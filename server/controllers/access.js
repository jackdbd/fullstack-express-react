const { User, createUser } = require("../models/user");
const HttpStatus = require("http-status-codes");

const NOT_FOUND = "RESOURCE NOT FOUND";

/**
 * Log a user in and send a JWT back.
 *
 * @param {User} user Mongoose User model.
 * @param {obj} res   Express HTTP response.
 * @see models/user/User
 */
async function loginUserWithToken(user, res) {
  if (user) {
    const { username, numLikes } = user;
    try {
      const message = `Hi ${username} (${numLikes} likes) You are now logged in!`;
      const token = await user.generateAuthToken();
      return res.status(HttpStatus.OK).json({ message, token, auth: true });
    } catch (err) {
      // TODO: instead of sending the stack trace to the client, I should write
      // it to an error.log with winston
      message =
        "You probably forgot to set the environment variable to sign the JWT token";
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: { message, stack_trace: err.stack } });
    }
  } else {
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
  let user;
  try {
    user = await createUser(req.body);
  } catch (err) {
    // TODO: one should not return the Mongoose/MongoDB error. Maybe it's better
    // to log it with a "dev" logger level.
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  return await loginUserWithToken(user, res);
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
  const { email, username, password } = req.body;
  let user;
  try {
    user = await User.getUserByEmail(email);
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  return await loginUserWithToken(user, res);
}

module.exports = {
  signup,
  login
};
