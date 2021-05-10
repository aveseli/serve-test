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
const jsRuntimeMainGlob = path.join(__dirname, "build/static/js/runtime-main.*.js");


const jsAndCssFiles = {
  cssMainChunkFile: glob.sync(cssMainChunkGlob, null).find(() => true),
  jsMainChunkFile: glob.sync(jsMainChunkGlob, null).find(() => true),
  jsChunkFile: glob.sync(jsChunkGlob, null).find(() => true),
  jsRuntimeMainFile: glob.sync(jsRuntimeMainGlob, null).find(() => true),
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

app.use("/static", express.static(path.join(__dirname, "build")));

app.get("/config.js", function(req, res) {
  res.sendFile(path.join(__dirname, "config", "config.prod.js"));
});

app.get("/static/static/css/main.chunk.css", function (req, res) {
  res.sendFile(jsAndCssFiles.cssMainChunkFile);
});

app.get("/static/static/js/main.chunk.js", function (req, res) {
  res.sendFile(jsAndCssFiles.jsMainChunkFile);
});

app.get("/static/static/js/magic.js", function (req, res) {
  res.sendFile(jsAndCssFiles.jsChunkFile);
});

app.get("/static/static/js/runtime-main.js", function (req, res) {
  res.sendFile(jsAndCssFiles.jsRuntimeMainFile);
});

app.get("/static/*", function (req, res) {
  console.log("File not found, serving index.html");
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 3000;

app.listen(port);
console.log(`listening on port ${port}`);
