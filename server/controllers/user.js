const { User, createUser, updateUser, deleteUser } = require("../models/user");
const HttpStatus = require("http-status-codes");
const NOT_FOUND = "RESOURCE NOT FOUND";

/**
 * Get​ ​the​ ​user​ with the specified ID.
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function get(req, res) {
  let user;
  try {
    user = await User.getUserById(req.params.id);
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (user) {
    const { username, numLikes } = user;
    return res.status(HttpStatus.OK).json({ username, numLikes });
  } else {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ error: { message: NOT_FOUND } });
  }
}

/**
 * Like a user
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function like(req, res) {
  let doc;
  try {
    doc = await User.getUserById(req.params.id);
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (!doc) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ error: { message: NOT_FOUND } });
  }

  const newObj = Object.assign({}, doc._doc, {
    numLikes: doc._doc.numLikes + 1
  });
  const message = `User ${doc.id} numLikes: ${doc.numLikes} -> ${
    newObj.numLikes
  }`;

  try {
    const newDoc = await updateUser(doc.id, newObj);
    return res.status(HttpStatus.OK).json({ message, old: doc, new: newObj });
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
}

/**
 * Unlike a user
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function unlike(req, res) {
  let doc;
  try {
    doc = await User.getUserById(req.params.id);
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (!doc) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ error: { message: NOT_FOUND } });
  }

  const newValue = doc._doc.numLikes - 1;
  const numLikes = newValue > 0 ? newValue : 0;
  const newObj = Object.assign({}, doc._doc, { numLikes });
  const message = `User ${doc.id} numLikes: ${doc.numLikes} -> ${
    newObj.numLikes
  }`;

  try {
    const newDoc = await updateUser(doc.id, newObj);
    return res.status(HttpStatus.OK).json({ message, old: doc, new: newObj });
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
}

/**
 * Delete a user.
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function deleteId(req, res) {
  const { id } = req.params;
  let user;
  try {
    user = await User.getUserById(id);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (!user) {
    res.status(HttpStatus.NOT_FOUND).json({ error: { message: NOT_FOUND } });
  }

  try {
    const doc = await deleteUser(id);
    const message = `User ${id} deleted from the database`;
    res.status(HttpStatus.OK).json({ message });
  } catch (err) {
    res.json({ error: err });
  }
}

module.exports = {
  get,
  like,
  unlike,
  deleteId
};
