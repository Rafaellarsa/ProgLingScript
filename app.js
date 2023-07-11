var express = require("express");
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var rateLimit = require("express-rate-limit");
var app = express();
var server = http.createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));
app.use(helmet());
app.use(limiter);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post("/result", function (req, res) {
  try {
    res.header("Content-Security-Policy", "script-src SELF 'nonce-test';");
    const executionReturn = eval(req.body.code)?.toString();
    const result = executionReturn
      ? "Retorno: " + executionReturn
      : req.body.code + " executado";
    res.cookie("result", result);
    res.sendFile(path.join(__dirname, "./public/result.html"));
  } catch (err) {
    res.send(`Erro ao executar código - ${err.message}`);
    return console.error(err.message);
  }
});

server.listen(3000, function () {
  console.log("Servidor rodando na porta: 3000");
});
