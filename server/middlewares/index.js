const passport = require("./passport");

function authOrRedirect(req, res, next) {
  console.log("Authenticated?", req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = {
  passport,
  authOrRedirect
};
