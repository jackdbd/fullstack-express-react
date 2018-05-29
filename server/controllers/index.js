const { User, createUser, updateUser, deleteUser } = require("../models/user");
const HttpStatus = require("http-status-codes");

const NOT_FOUND = "RESOURCE NOT FOUND";

/** POST /signup
 * Register anew user and generate an authentication token (e.g. JSON Web Token)
 * for the client to include in future requests with the server.
 *
 * @param {object} req
 * @param {object} res
 */
exports.signup_post = async function(req, res) {
  let user;
  try {
    user = await createUser(req.body);
  } catch (err) {
    // TODO: one should not return the Mongoose/MongoDB error. Maybe it's better
    // to log it with a "dev" logger level.
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (user) {
    const message = "You are now registered and logged in";
    const token = user.generateAuthToken();
    return res.status(HttpStatus.OK).json({ token, auth: true });
  } else {
    // TODO: is that possible to NOT have a user at this point?
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ error: { message: NOT_FOUND } });
  }
};

/** POST /login
 * Generate an authentication token (e.g. JSON Web Token) for the client to
 * include in future requests with the server.
 *
 * @param {object} req
 * @param {object} res
 */
exports.login_post = async function(req, res) {
  const { email, username, password } = req.body;
  let user;
  try {
    user = await User.getUserByEmail(email);
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (user) {
    const message = "You are now logged in";
    const token = user.generateAuthToken();
    return res.status(HttpStatus.OK).json({ message, token, auth: true });
  } else {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ error: { message: NOT_FOUND } });
  }
};

/** GET /me
 * It should be used after an authentication middleware, so the user id is
 * available in res.locals.
 * Get​ ​the​ currently logged in ​user information.
 *
 * @param {object} req
 * @param {object} res
 */
exports.me_get = async function(req, res) {
  // console.log('req.locals.userId', res.locals.userId)
  const id = res.locals.userId;
  let user;
  try {
    user = await User.getUserById(id);
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
};

/** PUT /me/update-password
 * It should be used after an authentication middleware, so the user id is
 * available in res.locals.
 * Update the password of the authenticated user.
 *
 * @param {object} req
 * @param {object} res
 */
exports.me_update_password_put = async function(req, res) {
  const { newPassword } = req.body;
  // console.log('req.locals.userId', res.locals.userId)
  const id = res.locals.userId;
  let user;
  try {
    user = await User.getUserById(id);
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ error: { message: NOT_FOUND } });
  }

  const obj = Object.assign({}, user, { password: newPassword })._doc;

  try {
    const newUser = await updateUser(user.id, obj);
    const message = `User ${id} updated the password`;
    //  console.log('user.password\n', user.password, '\nobj.password\n', obj.password, '\nnewUser.password\n', newUser.password)
    return res.status(HttpStatus.OK).json({ message });
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
};

/** Get​ ​the​ ​user​ with the specified ID
 *
 * @param {object} req
 * @param {object} res
 */
exports.user_id_get = async function(req, res) {
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
};

/** PUT /user/:id/like
 * Like a user
 *
 * @param {*} req
 * @param {*} res
 */
exports.user_id_like_put = async function(req, res) {
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
};

/** PUT /user/:id/unlike
 * Unlike a user
 *
 * @param {*} req
 * @param {*} res
 */
exports.user_id_unlike_put = async function(req, res) {
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
};

exports.user_id_delete = async function(req, res) {
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
};

/** GET /most-liked
 * Return a list of users, sorted by numLikes in descending order.
 *
 * @param {object} req
 * @param {object} res
 */
exports.most_liked_get = async function(req, res) {
  let docs;
  try {
    docs = await User.find({}, ["username", "numLikes", "_id"], {
      sort: { numLikes: -1 }
    });
    return res.json(
      docs.map(d => ({ username: d.username, numLikes: d.numLikes, id: d._id }))
    );
  } catch (err) {
    return res.json({ error: err });
  }
};
