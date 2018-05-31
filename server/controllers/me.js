const { User, createUser, updateUser } = require("../models/user");
const HttpStatus = require("http-status-codes");
const NOT_FOUND = "RESOURCE NOT FOUND";

/**
 * Get the currently logged in user.
 *
 * It should be used after an authentication middleware, so the user id is
 * available in res.locals.
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function get(req, res) {
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
}

/**
 * Update the currently logged in user's password.
 *
 * It should be used after an authentication middleware, so the user id is
 * available in res.locals.
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function updatePassword(req, res) {
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
}

module.exports = {
  get,
  updatePassword
};
