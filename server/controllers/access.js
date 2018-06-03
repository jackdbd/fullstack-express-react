const { User, createUser } = require("../models/user");
const HttpStatus = require("http-status-codes");
const logger = require("../config/winston");

const NOT_FOUND = "RESOURCE NOT FOUND";

/**
 * Log a user in and send a JWT back.
 *
 * @param {User} user Mongoose User model.
 * @param {obj} res   Express HTTP response.
 * @see models/user/User
 */
async function loginUserWithToken(user, res) {
  let message;
  if (user) {
    const { username, email, numLikes } = user;
    logger.debug(`Trying to generate AUTH token for ${username}`);
    try {
      const token = await user.generateAuthToken();
      logger.debug(`Token generated: ${username} is now authenticated`);
      message = `Hi ${username} (${numLikes} likes)!`;
      return res.status(HttpStatus.OK).json({
        message,
        username,
        email,
        numLikes,
        token,
        id: user._id,
        auth: true
      });
    } catch (err) {
      logger.error(err);
      message = "There was an issue signing the AUTH token.";
      logger.error(message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: { message } });
    }
  } else {
    logger.debug(`User ${user.username} not found. Cannot authenticate.`);
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ error: { message: NOT_FOUND } });
  }
}

/**
 * Register a new user.
 *
 * Register a new user and generate a JWB (JSON Web Token) to authenticate
 * client's requests to the server.
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function signup(req, res) {
  logger.debug(`Try to signup user ${req.body.username}`);
  let user;
  let message;
  try {
    user = await createUser(req.body);
    logger.debug(`User ${req.body.username} created in DB (id: ${user._id})`);
  } catch (err) {
    logger.error(err);
    /*
      TODO: improve error message by looking at the duplicate key error in
      mongodb. It could be a duplicate username/email/password (do I need to
      parse the MongoDB error?)
    */
    message = `User ${req.body.username} cannot signup`;
    return res.status(HttpStatus.BAD_REQUEST).json({ error: message });
  }
  try {
    await loginUserWithToken(user, res);
  } catch (err) {
    console.log(err);
  }
  // return
}

/**
 * Log an existing user in.
 *
 * Log an existing user in and generate a JWB (JSON Web Token) to authenticate
 * client's requests to the server.
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function login(req, res) {
  logger.debug(`Try to login user ${req.body.username}`);
  const { email, username, password } = req.body;
  let user;
  let message;
  try {
    user = await User.getUserByEmail(email);
    logger.debug(`User ${req.body.username} found in DB`);
  } catch (err) {
    logger.error(err);
    message = `User ${req.body.username} cannot login`;
    return res.status(HttpStatus.BAD_REQUEST).json({ error: message });
  }
  return await loginUserWithToken(user, res);
}

module.exports = {
  signup,
  login
};
