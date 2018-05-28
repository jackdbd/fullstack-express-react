const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models/user");

passport.use(
  new LocalStrategy({}, function(username, password, done) {
    // TODO: check if we need to distinguish between user and false in .then
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
