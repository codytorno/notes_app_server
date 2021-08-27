const express = require("express");
const cors = require("cors");
const app = express();
const dotenvExpand = require("dotenv-expand");
dotenvExpand(require("dotenv").config({ path: ".env" }));
const Note = require("./models/note");
const Logger = require("./logger");
const { response } = require("express");

app.use(express.static("build"));
app.use(express.json());
app.use(Logger);
app.use(cors());

// Gets all notes
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// gets the front end of website
app.get("/", (request, response) => {
  // if static front end is not built correctly throw 404 status error
  response.status(404).end();
});

// Get a single note in the database using ID
app.get("/api/notes/:id", (request, response, next) => {
  // use Mongoose method to find by id
  console.log(request.params.id);
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Delete a single note from database using ID
app.delete("/api/notes/:id", (request, response, next) => {
  // use Mongoose method to find and delete by id
  Note.findByIdAndRemove(request.params.id)
    .then((deletedNote) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// update a note
app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;
  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

// Adds a new note to the database
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  // create new note object
  const newNote = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  // save note to database
  newNote.save().then((savedNote) => {
    response.json(savedNote);
  });
});

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

// this has to be the last loaded middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

// this has to be the last loaded middleware
app.use(errorHandler);

// listen to port 3001 in dev or whatever port heroku creates
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});
