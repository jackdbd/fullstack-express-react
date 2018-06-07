const { User, createUser, updateUser } = require("../models/user");
const HttpStatus = require("http-status-codes");
const logger = require("../config/winston");

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
  const id = res.locals.userId;
  logger.debug(`res.locals.userId: ${id}`);
  logger.debug(`Trying to find in DB the currently authenticated user`);
  let user;
  try {
    user = await User.getUserById(id);
  } catch (err) {
    message = `There was an issue in finding user ${id}`;
    logger.error(err);
    return res.status(HttpStatus.BAD_REQUEST).json({ error: message });
  }
  if (user) {
    const { username, numLikes, relationships } = user;
    return res
      .status(HttpStatus.OK)
      .json({ username, numLikes, relationships });
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
  const id = res.locals.userId;
  logger.debug(`res.locals.userId: ${id}`);
  logger.debug(`Trying to find in DB the currently authenticated user`);
  let user;
  let message;
  try {
    user = await User.getUserById(id);
  } catch (err) {
    logger.error(err);
    message = `There was an issue in finding user ${id}`;
    return res.status(HttpStatus.BAD_REQUEST).json({ error: message });
  }
  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ error: { message: NOT_FOUND } });
  }

  const obj = Object.assign({}, user, { password: newPassword })._doc;

  try {
    const newUser = await updateUser(user.id, obj);
    logger.debug(`User ${id} updated the password`);
    message = "You updated your password";
    //  console.log('user.password\n', user.password, '\nobj.password\n', obj.password, '\nnewUser.password\n', newUser.password)
    return res.status(HttpStatus.OK).json({ message });
  } catch (err) {
    logger.error(err);
    message = "There was an issue in updating the user data";
    return res.status(HttpStatus.BAD_REQUEST).json({ error: message });
  }
}

module.exports = {
  get,
  updatePassword
};
