const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const user = require("../models/user");

// console.log("module.function", user.getUserByUsername);
// console.log("module.Model().instancemethod", user.User({}).generateAuthToken);
// console.log("User.getUserByUsername", User.getUserByUsername);

passport.use(
  new LocalStrategy({}, function(username, password, done) {
    console.log("LocalStrategy -> getUserByUsername");
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "Unknown User" });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  console.log("serializeUser");
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("deserializeUser");
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
