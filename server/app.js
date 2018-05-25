require("dotenv").load();
const express = require("express");
const bodyParser = require("body-parser");
const { apiRoutes } = require("./routes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", apiRoutes);

module.exports = app;
