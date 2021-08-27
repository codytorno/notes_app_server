const mongo = require("mongoose");
const dotenvExpand = require("dotenv-expand");
dotenvExpand(require("dotenv").config({ path: ".env" }));

// in console type node mongo.js -users

// verify the correct number of arguments before connecting to database
if (process.argv.length < 3) {
  console.log("Error: Incorrect Format: try node mongo.js -users");
  process.exit();
}

console.log("arguments:", process.argv.length);
console.log("argument 0", process.argv[0]); // the note exe path
console.log("argument 1", process.argv[1]); // the path to this file
console.log("argument 2", process.argv[2]); // function to run
console.log("argument 3", process.argv[3]); // content
console.log("argument 3", process.argv[3]); // isImportant

// the url for the mongodb database that will store the objects as documents
const url = process.env.URI;

// create connection
console.log("connecting to", url);
mongo.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// define the schema of the object to be stored
const noteSchema = mongo.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

// create a model from the schema to be used to create new objects
const Note = mongo.model("Note", noteSchema);

// function that adds new note to database
const createNote = (iContent, isImportant) => {
  //create new note
  let newNote = new Note({
    content: iContent,
    date: new Date(),
    important: isImportant,
  });
  console.log("note", newNote);

  newNote.save().then((result) => {
    console.log(`added note to the database!`);
    mongo.connection.close();
  });
};

const showAllNotes = () => {
  Note.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note.content, note.date, note.important);
    });
    mongo.connection.close();
  });
};

if (process.argv[2] === "-users") {
  showAllNotes();
}

if (process.argv[2] === "-add" && process.argv[3] && process.argv[4]) {
  createNote(process.argv[3], process.argv[4]);
}
