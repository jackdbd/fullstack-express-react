require("dotenv").load();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const morgan = require("morgan");
const { apiRoutes } = require("./routes");
const logger = require("./config/winston");

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", { stream: logger.stream }));
} else {
  app.use(morgan("dev", { stream: logger.stream }));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRoutes);

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
