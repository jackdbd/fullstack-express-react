/**
 * Authorization middlewares.
 *
 * @module middlewares/authorize
 */
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const logger = require("../config/winston");

const verify = (token, secret) => {
  return new Promise((resolve, reject) => {
    return jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

function verifyAuth(req, res, next) {
  logger.debug("verifyAuth middleware");
  const token = req.headers["x-access-token"];
  const secret = process.env.JWT_SECRET;

  let message;
  verify(token, secret)
    .then(decoded => {
      message = "Token included and verified. Proceed to next middleware";
      logger.debug(message);
      // use res.locals to make the variable available in the next middleware
      // http://expressjs.com/en/api.html#res.locals
      res.locals.userId = decoded._id;
      next();
    })
    .catch(err => {
      message = "You need to be authenticated in order to perform this action";
      logger.warn(message);
      // HTTP 401 VS 403: https://stackoverflow.com/a/6937030/3036129
      return res.status(HttpStatus.UNAUTHORIZED).json({ auth: false, message });
    });
}

module.exports = {
  verifyAuth
};
