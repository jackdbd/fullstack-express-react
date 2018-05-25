require("dotenv").load();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("./db");
const { apiRoutes } = require("./routes");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT}!`);
});
