require("dotenv").load();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const logger = require("morgan");
const { clearRoutes, authRoutes } = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);

app.use(logger("dev"));
// app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use("/", clearRoutes);
app.use("/", authRoutes);

module.exports = app;
