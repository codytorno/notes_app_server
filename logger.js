// Logger
const morgan = require("morgan");

// const logger = morgan("tiny");
morgan.token("post-body", function (req) {
  return JSON.stringify(req.body);
});

const logger = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    tokens["post-body"](req, res),
  ].join(" ");
});

module.exports = logger;
