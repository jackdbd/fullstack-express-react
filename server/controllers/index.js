const { User } = require("../models");

exports.signup_post = async function(req, res) {
  res.send({ TODO: "Sign​ ​up​ ​to​ ​the​ ​system​ ​(username,​ ​password)" });
};

exports.login_post = async function(req, res) {
  res.send({ TODO: "Logs​ ​in​ ​an​ ​existing​ ​user​ ​with​ ​a​ ​password" });
};

exports.me_get = async function(req, res) {
  // TODO: get the _id of the mongo document from the JWT, then use it to fetch the user from MongoDB
  const someUser = await User.findOne();
  // const someNonExistingUserId = '5b084814c8b07925ff812501'
  // const someInvalidId = '123'
  let user;
  try {
    user = await User.findOne({ _id: someUser._id });
    // user = await User.findOne({ _id: someNonExistingUserId });
    // user = await User.findOne({ _id: someInvalidId });
  } catch (err) {
    // TODO: how to handle mongoose CastError when the id is invalid?
    console.log(err);
    throw err;
  }
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found!" });
  }
};

exports.me_update_password_put = async function(req, res) {
  res.send({ TODO: "AUTH Update​ ​the​ ​current​ ​user's​ ​password" });
};

exports.user_id_get = async function(req, res) {
  res.send({
    TODO: "List​ ​username​ ​&​ ​number​ ​of​ ​likes​ ​of​ ​a​ ​user"
  });
};

exports.user_id_like_get = async function(req, res) {
  res.send({ TODO: "AUTH Like a user" });
};

exports.most_liked_get = async function(req, res) {
  res.send({
    TODO: "List​ ​users​ ​in​ ​a​ ​most​ ​liked​ ​to​ ​least​ ​liked"
  });
};
