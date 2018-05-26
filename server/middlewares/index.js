const passport = require("./passport");

function authOrRedirect(req, res, next) {
  // console.log("Authenticated?", req.isAuthenticated());
  // console.log(req.method, req.url);
  if (req.isAuthenticated()) {
    // it seems that both next() and return next() work fine
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = {
  passport,
  authOrRedirect
};
