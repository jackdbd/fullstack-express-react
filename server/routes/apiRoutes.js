// require("dotenv").load();
const express = require("express");
const { User } = require("../models");

const router = express.Router();

router.post("/signup", (req, res) => {
  res.send({ TODO: "Sign​ ​up​ ​to​ ​the​ ​system​ ​(username,​ ​password)" });
});

router.post("/login", (req, res, next) => {
  // console.log(req.body);
  console.log('req', req, 'res', res, 'next', next)
  res.send({ TODO: "Logs​ ​in​ ​an​ ​existing​ ​user​ ​with​ ​a​ ​password" });
});

router.get("/me", async (req, res) => {
  // TODO: get the _id of the mongo document from the JWT, then use it to fetch the user from MongoDB
  const someUser = await User.findOne();
  // const someNonExistingUserId = '5b084814c8b07925ff812501'
  // const someInvalidId = '123'
  let user
  try {
    user = await User.findOne({ _id: someUser._id });
    // user = await User.findOne({ _id: someNonExistingUserId });
    // user = await User.findOne({ _id: someInvalidId });
  } catch (err) {
    // TODO: how to handle mongoose CastError when the id is invalid?
    console.log(err)
    throw err;
  }
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({error: "User not found!"})
  }
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
