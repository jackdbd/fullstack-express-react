require("dotenv").load();
const mongoose = require("mongoose");
const logger = require("../config/winston");

/*
  The connection to the database is an asynchronous operation, but there is no
  need to use await or .then(), since mongoose takes care of it automatically.
*/
mongoose.connect(
  process.env.MONGODB_URI,
  function() {
    logger.warn("MongoDB connected");
  }
);

module.exports = mongoose;
