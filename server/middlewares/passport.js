/**
 * Passport authentication middleware.
 *
 * @module middlewares/passport
 */
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const logger = require("../config/winston");
const { User } = require("../models/user");

const LocalStrategyOptions = {};

passport.use(
  new LocalStrategy(LocalStrategyOptions, function(username, password, done) {
    logger.debug("Carry out Passport's LocalStrategy");
    User.getUserByCredentials(username, password)
      .then(user => {
        logger.debug("User found in DB");
        done(null, user);
      })
      .catch(err => {
        logger.warn("User not found in DB");
        done(null, false, { error: err });
      });
  })
);

passport.serializeUser(function(user, done) {
  logger.debug("serializeUser");
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  logger.debug(`deserializeUser ${id}`);
  User.getUserById(id)
    .then(user => {
      logger.debug("User deserialized");
      done(null, user);
    })
    .catch(err => {
      logger.error(`deserializeUser ${id}`, err);
      done(null, false, { error: err });
    });
});

module.exports = passport;
