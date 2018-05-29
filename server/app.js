const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const logger = require("morgan");
const { accessRoutes, apiRoutes } = require("./routes");

const app = express();
app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use("/", accessRoutes);
app.use("/", apiRoutes); // TODO: change "/" to "/api"

module.exports = app;
