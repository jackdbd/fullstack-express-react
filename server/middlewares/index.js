const passport = require("./passport");
const { authOrRedirect } = require("./redirects");

module.exports = {
  passport,
  authOrRedirect
};
