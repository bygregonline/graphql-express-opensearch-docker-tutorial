const fs = require("fs");

class TextFileReader {
  constructor(filePath) {
    this.filePath = filePath;
    this.linesArray = [];
    this.loadFile();
  }

  // Método para cargar el archivo
  loadFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, "utf8", (err, data) => {
        if (err) {
          console.error(`File ${this.filePath} not found`);
          process.exit()
          reject(err);
        } else {
          this.linesArray = data.split("\n").filter(line => line.trim() !== "");
          console.log("File loaded with ", this.linesArray.length, "Quotes");
          resolve(this.linesArray);
        }
      });
    });
  }

  // Método para obtener una línea aleatoria
  getRandomLine() {
    if (this.linesArray.length === 0) {
      return "File not loaded yet";
    }
    const randomIndex = Math.floor(Math.random() * this.linesArray.length);
    return this.linesArray[randomIndex];
  }
}

module.exports = TextFileReader;
