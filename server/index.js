require("dotenv").load();
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI);

const app = require("./app");

app.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT}!`);
});
