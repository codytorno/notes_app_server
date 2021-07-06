const express = require("express");
const cors = require("cors");
const app = express();
const dotenvExpand = require("dotenv-expand");
dotenvExpand(require("dotenv").config({ path: ".env" }));
const Note = require("./models/note");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

// gets the front end of website
app.get("/", (request, response) => {
  // if static front end is not built correctly throw 404 status error
  response.status(404).end();
});

// Gets all notes
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// Get a single note in the database using ID
app.get("/api/notes/:id", (request, response) => {
  // use Mongoose method to find by id
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

// Delete a single note from database using ID
app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndDelete(request.params.id).then((deletedNote) => {
    response.json(deletedNote);
  });
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

// listen to port 3001 in dev or whatever port heroku creates
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});
