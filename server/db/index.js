require("dotenv").load();
const mongoose = require("mongoose");

// the connection to the database is an asynchronous operation, but there is no
// need to use await or .then(), since mongoose takes care of it automatically.
mongoose.connect(process.env.MONGODB_URI);

module.exports = mongoose;
