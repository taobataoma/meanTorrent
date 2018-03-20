'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  common = require(path.resolve('./config/lib/common')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Invitation = mongoose.model('Invitation'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  crypto = require('crypto'),
  moment = require('moment'),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var smtpTransport = nodemailer.createTransport(config.mailer.options);
var traceConfig = config.meanTorrentConfig.trace;
var passwordConfig = config.meanTorrentConfig.password;
var appConfig = config.meanTorrentConfig.app;

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.usernameOrEmail) {

        var usernameOrEmail = String(req.body.usernameOrEmail).toLowerCase();

        User.findOne({
          $or: [
            {username: usernameOrEmail},
            {email: usernameOrEmail}
          ]
        }, '-salt -password', function (err, user) {
          if (err || !user) {
            return res.status(400).send({
              message: 'SERVER.NO_ACCOUNT_WITH_THAT_USERNAME_OR_EMAIL'
            });
          } else if (user.provider !== 'local') {
            return res.status(400).send({
              message: 'It seems like you signed up using your ' + user.provider + ' account, please sign in using that provider.'
            });
          } else if (user.nextResetPasswordTime > Date.now()) {
            return res.status(400).send({
              message: 'SERVER.RESET_PASSWORD_TO_FREQUENT',
              params: {
                hours: passwordConfig.resetTimeInterval / (60 * 60 * 1000),
                nextTime: user.nextResetPasswordTime
              }
            });
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + passwordConfig.resetTokenExpires;
            user.nextResetPasswordTime = Date.now() + passwordConfig.resetTimeInterval;

            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.status(422).send({
          message: 'SERVER.USERNAME_EMAIL_NOT_BE_BLANK'
        });
      }
    },
    function (token, user, done) {
      var lang = common.getRequestLanguage(req);

      res.render(path.resolve('modules/users/server/templates/reset-password-email-' + lang), {
        name: user.displayName,
        appName: config.app.title,
        url: appConfig.domain + '/api/auth/reset/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'SERVER.SENDING_RESET_MAIL_SUCCESSFULLY'
          });
        } else {
          return res.status(400).send({
            message: 'SERVER.SENDING_RESET_MAIL_FAILED'
          });
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (err || !user) {
      return res.redirect('/password/reset/invalid');
    }

    res.redirect('/password/reset/' + req.params.token);
  });
};

/**
 * invite sign up from email token
 */
exports.invite = function (req, res, next) {
  Invitation.findOne({
    token: req.params.token,
    status: 1,
    expiresat: {
      $gt: Date.now()
    }
  }, function (err, invitation) {
    if (err || !invitation) {
      return res.redirect('/authentication/invite/invalid');
    }

    res.redirect('/authentication/signup?token=' + req.params.token);
  });
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;

  async.waterfall([

    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
              if (err) {
                return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    // Remove sensitive data before return authenticated user
                    user.password = undefined;
                    user.salt = undefined;

                    res.json(user);

                    //create trace log
                    traceLogCreate(req, traceConfig.action.userPasswordReset, {
                      user: user._id,
                      newPassword: passwordDetails.newPassword
                    });

                    done(err, user);
                  }
                });
              }
            });
          } else {
            return res.status(422).send({
              message: 'SERVER.PASSWORDS_DO_NOT_MATCH'
            });
          }
        } else {
          return res.status(400).send({
            message: 'SERVER.RESET_TOKEN_INVALID'
          });
        }
      });
    },
    function (user, done) {
      var lang = common.getRequestLanguage(req);

      res.render(path.resolve('modules/users/server/templates/reset-password-confirm-email-' + lang), {
        name: user.displayName,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save(function (err) {
                if (err) {
                  return res.status(422).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(user, function (err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(422).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(422).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(422).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * resetPasskey
 */
exports.resetPasskey = function (req, res, next) {
  if (req.user) {
    var user = req.user;
    user.passkey = user.randomAsciiString(32);

    user.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * changeSignature
 * @param req
 * @param res
 * @param next
 */
exports.changeSignature = function (req, res, next) {
  if (req.user) {
    var user = req.user;
    user.signature = req.body.signature;

    user.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(user);
      }
    });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};
