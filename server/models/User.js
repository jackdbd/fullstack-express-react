const mongoose = require("mongoose");

const collection = "users";
const schema = new mongoose.Schema({
  name: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model(collection, schema);

module.exports = User;
