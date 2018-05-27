const { User, getUserById, updateUser, deleteUser } = require("../models/user");
const HttpStatus = require("http-status-codes");

const NOT_FOUND = "RESOURCE NOT FOUND";

function extractIdFromJWT() {
  // TODO: to be implemented
  const id = "5b0977ba76d8c83817f451ed";
  return id;
}

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
  const id = extractIdFromJWT();
  let user;
  try {
    user = await getUserById(id);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (user) {
    res.status(HttpStatus.OK).json(user);
  } else {
    res.status(HttpStatus.NOT_FOUND).json({ error: { message: NOT_FOUND } });
  }
};

exports.me_update_password_put = async function(req, res) {
  const { newPassword } = req.body;
  const id = extractIdFromJWT();
  let doc;
  try {
    doc = await getUserById(id);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (!doc) {
    res.status(HttpStatus.NOT_FOUND).json({ error: { message: NOT_FOUND } });
  }

  const newObj = Object.assign({}, doc._doc, { password: newPassword });

  try {
    const newDoc = await updateUser(doc.id, newObj);
    const message = `User ${id} updated the password`;
    /* Important!
      newObj.password is the new, unhashed password (i.e. the password chosen by
      the user, before saving the object as a new mongoose model instance);
      newDoc.password is the new, hashed password (i.e. the password created by
      Mongoose in the "save" hook, and stored in MongoDB)
    */
    res.status(HttpStatus.OK).json({ message });
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
};

exports.user_id_get = async function(req, res) {
  let user;
  try {
    user = await getUserById(req.params.id);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (user) {
    res.status(HttpStatus.OK).json(user);
  } else {
    res.status(HttpStatus.NOT_FOUND).json({ error: { message: NOT_FOUND } });
  }
};

exports.user_id_like_put = async function(req, res) {
  let doc;
  try {
    doc = await getUserById(req.params.id);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (!doc) {
    res.status(HttpStatus.NOT_FOUND).json({ error: { message: NOT_FOUND } });
  }

  const newObj = Object.assign({}, doc._doc, {
    numLikes: doc._doc.numLikes + 1
  });
  const message = `User ${doc.id} numLikes: ${doc.numLikes} -> ${
    newObj.numLikes
  }`;

  try {
    const newDoc = await updateUser(doc.id, newObj);
    res.status(HttpStatus.OK).json({ message, old: doc, new: newObj });
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
};

exports.user_id_unlike_put = async function(req, res) {
  let doc;
  try {
    doc = await getUserById(req.params.id);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (!doc) {
    res.status(HttpStatus.NOT_FOUND).json({ error: { message: NOT_FOUND } });
  }

  const newValue = doc._doc.numLikes - 1;
  const numLikes = newValue > 0 ? newValue : 0;
  const newObj = Object.assign({}, doc._doc, { numLikes });
  const message = `User ${doc.id} numLikes: ${doc.numLikes} -> ${
    newObj.numLikes
  }`;

  try {
    const newDoc = await updateUser(doc.id, newObj);
    res.status(HttpStatus.OK).json({ message, old: doc, new: newObj });
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
};

exports.user_id_delete = async function(req, res) {
  const { id } = req.params;
  let user;
  try {
    user = await getUserById(id);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (!user) {
    res.status(HttpStatus.NOT_FOUND).json({ error: { message: NOT_FOUND } });
  }

  try {
    const doc = await deleteUser(id);
    const message = `User ${id} deleted from the database`;
    res.status(HttpStatus.OK).send({ message });
  } catch (err) {
    res.json({ error: err });
  }
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
