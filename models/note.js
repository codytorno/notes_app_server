const mongoose = require("mongoose");

// define the schema of the object to be stored
const noteSchema = mongoose.Schema({
  content: {
    type: String,
    minLength: 2,
    required: [true, "Content is required"],
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
});

// transform note data to be strings and remove unwanted information
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
