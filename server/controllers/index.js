/**
 * Controller functions (i.e. route handlers).
 *
 * @module controllers
 * @see routes
 */
const me = require("./me");
const access = require("./access");
const user = require("./user");
const mostLiked = require("./most-liked");

module.exports = {
  access,
  user,
  me,
  mostLiked
};
