const express = require("express");

const router = express.Router();

router.post("/signup", (req, res) => {
  res.send({ TODO: "Sign​ ​up​ ​to​ ​the​ ​system​ ​(username,​ ​password)" });
});

router.post("/login", (req, res) => {
  res.send({ TODO: "Logs​ ​in​ ​an​ ​existing​ ​user​ ​with​ ​a​ ​password" });
});

router.get("/me", (req, res) => {
  res.send({
    TODO: "AUTH Get​ ​the​ ​currently​ ​logged​ ​in​ ​user​ ​information"
  });
});

// I think update password should be idempotent, so PUT is better than POST
router.put("/me/update-password", (req, res) => {
  res.send({ TODO: "AUTH Update​ ​the​ ​current​ ​user's​ ​password" });
});

router.get("/user/:id/", (req, res) => {
  res.send({
    TODO: "List​ ​username​ ​&​ ​number​ ​of​ ​likes​ ​of​ ​a​ ​user"
  });
});

router.get("/user/:id/like", (req, res) => {
  res.send({ TODO: "AUTH Like a user" });
});

router.get("/most-liked", (req, res) => {
  res.send({
    TODO: "List​ ​users​ ​in​ ​a​ ​most​ ​liked​ ​to​ ​least​ ​liked"
  });
});

module.exports = router;
