const express = require("express");
require("dotenv").config();
const os = require("os");
const messages = require("./messages");
const utils = require("./utils");
const humanizeDuration = require("humanize-duration");
const app = express();
const serveIndex = require("serve-index");
const winston = require("winston");
const path = require("path");
const port = process.env.PORT || 3000;
const si = require("systeminformation");
const cors = require("cors");

const { Client } = require("@opensearch-project/opensearch");
const indexName = process.env.INDEX_NAME
const TextFileReader = require("./quotes");



const corsOptions = {
  origin: "http://example.com", // Permite solo solicitudes desde http://example.com
  methods: ["GET", "POST"], // Permite solo métodos GET y POST
  allowedHeaders: ["Content-Type"], // Permite solo el encabezado Content-Type
  credentials: true // Permite el uso de credenciales (cookies, headers de autenticación, etc.)
};

app.use(cors(corsOptions));

// const me = Object.create(person);

const quotes = new TextFileReader(process.env.QUOTES_FILE);

const logger = winston.createLogger({
  level: "info", // Nivel de log (info, warn, error, etc.)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // Transporte para enviar logs a un archivo
    new winston.transports.File({ filename: path.join(__dirname, "logs", "app.log") })
  ]
});



const client = new Client({

  node: process.env.OPENSEARCH_HOST,
  auth: {
    username: process.env.OPENSEARCH_USERNAME,
    password: process.env.OPENSEARCH_PASSWORD,
  },
});

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  next();
});


app.get("/openinfo", async (req, res) => {
  try {
    // Query para obtener todos los documentos de un índice

    const info = await client.info();

    res.json(info);
  } catch (error) {
    console.error("Error al buscar en OpenSearch:", error);
    res.status(500).json({ error: "Error al buscar en OpenSearch" });
  }
});



app.get("/openindexes", async (req, res) => {
  try {
    // Query para obtener todos los documentos de un índice

    const indexes = await client.cat.indices({ format: "json" });

    res.json(indexes.body);
  } catch (error) {
    console.error("Error al buscar en OpenSearch:", error);
    res.status(500).json({ error: "Error al buscar en OpenSearch" });
  }
});


app.get("/node", async (req, res) => {
  try {
    // Query para obtener todos los documentos de un índice
    const nodesStats = await client.nodes.stats();
    const auxDict = {
      cluster_name: nodesStats.body.cluster_name, // Agrega el nombre del cluster
      nodes: []
    };

    // Recorre los nodos
    for (const [nodeId, nodeData] of Object.entries(nodesStats.body.nodes)) {
      const nodeName = nodeData.name;
      const diskTotal = nodeData.fs.total.total_in_bytes;
      const diskFree = nodeData.fs.total.available_in_bytes;
      const diskUsed = diskTotal - diskFree;
      const diskUsedPercent = (diskUsed / diskTotal) * 100;

      auxDict.nodes.push({
        node_name: nodeName,
        disk_total: utils.formatBytes(diskTotal),
        disk_used: utils.formatBytes(diskUsed),
        disk_free: utils.formatBytes(diskFree),
        disk_used_percent: diskUsedPercent.toFixed(2) + "%"
      });
    }

    res.json(auxDict);
  } catch (error) {
    console.error("Error al buscar en OpenSearch:", error);
    res.status(500).json({ error: "Error al buscar en OpenSearch" });
  }
});




app.get("/search", async (req, res) => {
  try {

    const searchQuery = "depeche"

    const response = await client.search({
      index: indexName,
      body: {
        query: {
          multi_match: {
            query: searchQuery,
            fields: ["artist", "album", "lyrics"]
          }
        },
        _source: ["artist", "album", "genre", "title"],
        sort: [{ _score: { order: "desc" } }],
        highlight: {
          pre_tags: ["<span class='highlight'>"],
          post_tags: ["</span>"],
          fields: {
            artist: {},
            album: {},
            lyrics: {}
          }
        }
      }
    });

    console.log(response.body)

    const hits = response.body.hits.hits;
    res.json(hits);
  } catch (error) {
    console.error("Error al buscar en OpenSearch:", error);
    res.status(500).json({ error: "Error al buscar en OpenSearch" });
  }
});


app.get("/all/:format?", async (req, res) => {
  try {

    const format = req.params.format || 'json'; // Valor por defecto es 'json'

    // Verificar si el formato no está en las opciones permitidas
    const validFormats = ['json', 'html', 'txt'];
    if (!validFormats.includes(format)) {
      return res.status(400).send("Formato no soportado");
    }

    const response = await client.search({
      index: indexName,
      body: {
        query: {
          match_all: {}, // Trae todos los documentos del índice
        },
      },
      size: 10000, // Define cuántos documentos traer en cada página
    });


    const filteredDocuments = response.body.hits.hits.map(doc => {
      const { lyrics, path, ...filteredSource } = doc._source;
      return filteredSource;
    });

    if (format === 'json') {
      return res.json(filteredDocuments);
    } else if (format === 'html') {

      return res.send(utils.getnerateHtml(filteredDocuments));

    } else if (format === 'txt') {
      res.setHeader('Content-Type', 'text/plain');
      return res.send(utils.generateTxt(filteredDocuments));


    }


  } catch (error) {
    console.error("Error al buscar en OpenSearch:", error);
    return res.status(500).json({ error: "Error al buscar en OpenSearch" });
  }
});


app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.get("/ping", (req, res) => {
  res.send("pong");
});


app.get("/date", (req, res) => {

  const responseData = {
    current: utils.getCurrentDateTime(new Date())
  };


  res.json(responseData);

});


app.post("/submit", (req, res) => {
  console.log(req.body)
  console.log(req)

  console.log(req.body)

  const book = req.body.book;

  // console.log(`Book submitted: ${book}`);
  res.send(`Book submitted: ${book}`);
});




app.get("/info", async (req, res) => {
  const size1 = utils.formatBytes(os.totalmem());
  const uptimeInMilliseconds = os.uptime() * 1000; // Convertir segundos a milisegundos
  const humanReadableUptime = humanizeDuration(uptimeInMilliseconds, { largest: 4 }); // Muestra solo las tres unidades más grandes

  const responseData = {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    cpus: os.cpus().length,
    memory: size1,
    hostname: os.hostname(),
    type: os.type(),
    uptime: humanReadableUptime,
  };
  res.json(responseData);
});


app.get("/platform", async (req, res) => {
  si.osInfo().then(data => {

    res.json(data);

  }).catch(error => console.error(error));

});

app.get("/about", (req, res) => {
  res.send(messages.about);
});



app.get("/quote", (req, res) => {
  const responseData = {
    current: utils.getCurrentDateTime(new Date()),
    quote: quotes.getRandomLine(),
  };
  res.json(responseData);
});




app.use("/public", express.static("public"));
app.use("/public", serveIndex("public", { icons: true }));















app.use((req, res) => {
  res.status(404).json(messages.notFound);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Went Wrong!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


