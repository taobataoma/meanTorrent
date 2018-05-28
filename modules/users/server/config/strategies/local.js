'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  moment = require('moment'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

var signConfig = config.meanTorrentConfig.sign;

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
      }, '-remarks').populate('invited_by', 'username displayName profileImageURL isVip score uploaded downloaded')
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

          // if ((moment(Date.now()) - moment(user.last_signed)) > signConfig.idle.accountIdleForTime) {
          //   user.update({
          //     $set: {status: 'idle'}
          //   }).exec();
          //   user.status = 'idle';
          // }

          user.updateSignedTime();

          return done(null, user);
        });
    }
  ));
};
