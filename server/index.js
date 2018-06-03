require("dotenv").load();
const express = require("express");
const mongoose = require("mongoose");
const app = require("./app");
const logger = require("./config/winston");

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

logger.debug(`Environment: ${NODE_ENV}`);
if (NODE_ENV === "production") {
  logger.debug("Serve production static assets from frontend/build");
  app.use(express.static("frontend/build"));

  /*
    Express will serve the index.html file if it doesn't recognize a requested
    route (so the route will be handled by React Route DOM).
    Important: double check the path when you change project structure!
  */
  const path = require("path");
  app.get("*", (req, res) => {
    logger.debug(`${req.path} route not served by backend. Serve index.html`);
    res.sendFile(
      path.resolve(__dirname, "..", "frontend", "build", "index.html")
    );
  });
}

logger.debug("Connect to DB");
mongoose.connect(MONGODB_URI);

app.listen(PORT, () => {
  logger.debug(`Express server is listening on port:${PORT}`);
});
