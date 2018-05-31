/**
 * Redirect middlewares.
 *
 * @module middlewares/redirect
 */
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");

function authOrRedirect(req, res, next) {
  const token = req.headers["x-access-token"];
  const secret = process.env.JWT_SECRET;

  if (!token) {
    // res.status(HttpStatus.FORBIDDEN).json({ auth: false, message })
    return res.redirect("/login");
  }

  jwt.verify(token, secret, function(err, decoded) {
    if (err) {
      // message = 'Failed to authenticate token'
      // res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ auth: false, message })
      return res.redirect("/login");
    } else {
      // use res.locals to make the variable available in the next middleware
      // http://expressjs.com/en/api.html#res.locals
      res.locals.userId = decoded._id;
      // console.log('Middleware res.locals', res.locals)
      next();
    }
  });
}

module.exports = {
  authOrRedirect
};
