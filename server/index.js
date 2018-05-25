require("dotenv").load();

const PORT = process.env.PORT || 5000;

const app = require("./app");

app.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT}!`);
});
