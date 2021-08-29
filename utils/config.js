require("dotenv").config();

// separation of all environment variables

let PORT = process.env.PORT;
let URI = process.env.URI;

module.exports = { PORT, URI };
