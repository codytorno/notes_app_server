const mongoose = require("mongoose");

// the url for the mongodb database that will store the objects as documents
const url = process.env.URI;

// create connection
console.log("connecting to", url);
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB Database");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB Database", error.message);
  });

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
