'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy(
    {
      usernameField: 'usernameOrEmail',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, usernameOrEmail, password, done) {
      User.findOne({
        $or: [{
          username: usernameOrEmail.toLowerCase()
        }, {
          email: usernameOrEmail.toLowerCase()
        }]
      }).populate('invited_by', 'username displayName profileImageURL')
        .populate('makers', 'name')
        .exec(function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: 'SERVER.INVALID_USERNAME'
            });
          }
          if (!user.authenticate(password)) {
            return done(null, false, {
              message: 'SERVER.INVALID_PASSWORD'
            });
          }
          if (user.status === 'banned') {
            return done(null, false, {
              message: 'SERVER.YOU_ARE_BANNED'
            });
          }

          if (user.status === 'inactive') {
            return done(null, false, {
              message: 'SERVER.ACCOUNT_IS_NOT_ACTIVATED'
            });
          }

          return done(null, user);
        });
    }
  ));
};
