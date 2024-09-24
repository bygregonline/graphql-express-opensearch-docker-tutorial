import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone"
import { typeDefs } from "./schema.js";
const port = process.env.PORT || 4000
import  { Client } from "@opensearch-project/opensearch";
const indexName = process.env.INDEX_NAME

dotenv.config();


const client = new Client({
  node: process.env.OPENSEARCH_HOST,
  auth: {
    username: process.env.OPENSEARCH_USERNAME,
    password: process.env.OPENSEARCH_PASSWORD,
  },
});





// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    all: async () => {
      try {
        // Ejecutamos una consulta de búsqueda en OpenSearch para devolver todos los documentos
        const { body } = await client.search({
          index: indexName,  // Nombre del índice en OpenSearch
          body: {
            query: {
              match_all: {}  // Coincide con todos los documentos en el índice
            }
          },
          size: 3000  // Tamaño máximo de canciones a devolver (ajústalo según tus necesidades)
        });

        // Mapeamos los resultados para adaptarlos al esquema GraphQL
        return body.hits.hits.map(hit => hit._source);
      } catch (error) {
        console.error('Error al obtener todas las canciones:', error);
        throw new Error('Error al obtener todas las canciones');
      }
    }
  },

};


const server = new ApolloServer({
  typeDefs,
  resolvers,
});


const { url } = await startStandaloneServer(server, { listen: { port: port } });

console.log(`🚀 Server listening at: ${url}`);
