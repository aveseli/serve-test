const express = require("express");
const path = require("path");
var logger = require("morgan");
var glob = require("glob");

const cssMainChunkGlob = path.join(
  __dirname,
  "build/static/css/main.*.chunk.css"
);
const jsMainChunkGlob = path.join(__dirname, "build/static/js/main.*.chunk.js");
const jsChunkGlob = path.join(__dirname, "build/static/js/*[1-9].chunk.js");

const jsAndCssFiles = {
  cssMainChunkFile: glob.sync(cssMainChunkGlob, null).find(() => true),
  jsMainChunkFile: glob.sync(jsMainChunkGlob, null).find(() => true),
  jsChunkGlob: glob.sync(jsChunkGlob, null).find(() => true),
};

console.log(jsAndCssFiles);

const app = express();

// log requests
// https://github.com/expressjs/morgan
app.use(
  logger(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'
  )
);

app.use("/opc", express.static(path.join(__dirname, "build")));

app.get("/opc/static/css/main.chunk.css", function (req, res) {
  res.sendFile(jsAndCssFiles.cssMainChunkFile);
});

app.get("/opc/static/js/main.chunk.js", function (req, res) {
  res.sendFile(jsAndCssFiles.jsMainChunkFile);
});

app.get("/opc/static/js/magic.js", function (req, res) {
  res.sendFile(jsAndCssFiles.jsChunkGlob);
});

app.get("/opc/*", function (req, res) {
  console.log("File not found, serving index.html");
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 3000;

app.listen(port);
console.log(`listening on port ${port}`);
