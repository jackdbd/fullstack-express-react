/**
 * Passport authentication middleware.
 *
 * @module middlewares/passport
 */
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models/user");

const LocalStrategyOptions = {};

passport.use(
  new LocalStrategy(LocalStrategyOptions, function(username, password, done) {
    User.getUserByCredentials(username, password)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(null, false, { error: err });
      });
  })
);

passport.serializeUser(function(user, done) {
  // console.log("serializeUser", user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // console.log("deserializeUser", id);
  User.getUserById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(null, false, { error: err });
    });
});

module.exports = passport;
