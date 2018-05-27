require("dotenv").load();
const express = require("express");
const mongoose = require("mongoose");
const app = require("./app");

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

if (NODE_ENV === "production") {
  // Express will serve production assets
  app.use(express.static("frontend/build"));

  /*
    Express will serve the index.html file if it doesn't recognize a requested
    route (so the route will be handled by React Route DOM).
  */
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

mongoose.connect(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`Express server is listening on port:${PORT} (${NODE_ENV})`);
});
