const { User } = require("../models/user");
const HttpStatus = require("http-status-codes");

exports.index_get = async function(req, res) {
  res.json({ TODO: "GET / (React frotend)" });
};

exports.signup_get = async function(req, res) {
  res.send({ TODO: "GET /signup" });
};

exports.signup_post = async function(req, res) {
  res.send({ TODO: "POST /signup" });
};

exports.login_get = async function(req, res) {
  res.send({ TODO: "GET /login" });
};

exports.login_post = async function(req, res) {
  console.log("AUTHETICATED?", req.isAuthenticated());
  res.send({ TODO: "POST /login" });
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
    res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (user) {
    res.json(user);
  } else {
    res.status(HttpStatus.NOT_FOUND).json({ error: "User not found!" });
  }
};

exports.me_update_password_put = async function(req, res) {
  res.send({ TODO: "PUT (or PATCH) /me/update-password" });
};

exports.user_id_get = async function(req, res) {
  res.send({ TODO: "GET /user/:id" });
};

exports.user_id_like_post = async function(req, res) {
  res.send({ TODO: "POST /user/:id/like" });
};

exports.user_id_unlike_post = async function(req, res) {
  res.send({ TODO: "POST /user/:id/unlike" });
};

/**
 *
 *
 * @param {any} req
 * @param {any} res
 */
exports.most_liked_get = async function(req, res) {
  const docs = await User.find({}, ["username", "numLikes"], {
    sort: { numLikes: -1 }
  });
  res.json(docs.map(d => ({ username: d.username, numLikes: d.numLikes })));
};
