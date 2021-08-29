const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

logger.info("connecting to", config.URI);

// create connection
mongoose
  .connect(config.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => logger.info("connected to MongoDB Database"))
  .catch(error =>
    logger.error("error connecting to MongoDB Database", error.message)
  );

// app use statements
app.use(cors()); // manages cors issues between front and backend
app.use(express.static("build")); // on / request it loads the built react front end
app.use(express.json()); // allows for the conversion of objects to json
app.use(middleware.requestLogger); // logs all request data coming from server
app.use("/api/notes", notesRouter); // middleware handling all routes to the notes
app.use(middleware.unknownEndpoint); // manages unknown routes
app.use(middleware.errorHandler); // checks for specific errors thrown by the server

module.exports = app;
