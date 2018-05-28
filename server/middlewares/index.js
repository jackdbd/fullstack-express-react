const passport = require("./passport");
const { authOrRedirect } = require("./redirects");

console.log(authOrRedirect)

module.exports = {
  passport,
  authOrRedirect
};
