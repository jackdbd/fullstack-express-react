require("dotenv").load();
const express = require("express");
const { apiRoutes } = require("./routes");
const PORT = process.env.PORT || 5000;

const app = express();
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT}!`);
});
