const notesRouter = require("express").Router();
const Note = require("../models/note");

// Gets all notes
notesRouter.get("/", (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  });
});

// Get a single note in the database using ID
notesRouter.get("/:id", (request, response, next) => {
  // use Mongoose method to find by id
  console.log(request.params.id);
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

// Delete a single note from database using ID
notesRouter.delete("/:id", (request, response, next) => {
  // use Mongoose method to find and delete by id
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

// update a note
notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;
  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote);
    })
    .catch(error => next(error));
});

// Adds a new note to the database
notesRouter.post("/", (request, response, next) => {
  const body = request.body;

  // create new note object
  const newNote = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  // save note to database
  newNote
    .save()
    .then(savedNote => savedNote.toJSON())
    .then(savedNote => {
      response.json(savedNote);
    })
    .catch(error => next(error));
});

module.exports = notesRouter;
