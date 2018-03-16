'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  Invitation = mongoose.model('Invitation'),
  nodemailer = require('nodemailer'),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var smtpTransport = nodemailer.createTransport(config.mailer.options);
var mtConfig = config.meanTorrentConfig;
var appConfig = config.meanTorrentConfig.app;

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

var traceConfig = config.meanTorrentConfig.trace;

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;
  user.passkey = user.randomAsciiString(32);

  user.signUpActiveToken = user.randomAsciiString(32);
  user.signUpActiveExpires = Date.now() + mtConfig.sign.signUpActiveTokenExpires;

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //if is invited, update invite data
      if (req.body.inviteToken) {
        Invitation.update({token: req.body.inviteToken}, {$set: {status: 2, to_user: user._id, registeredat: Date.now()}}, function (err) {
        });
        //update user invited_by
        Invitation.findOne({
          token: req.body.inviteToken
        }, function (err, inv) {
          if (inv) {
            user.update({
              $set: {invited_by: inv.user}
            }).exec();
          }
        });
      }
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      /* send an account active mail */
      res.render(path.resolve('modules/users/server/templates/sign-up-active-email'), {
        name: user.displayName,
        appName: config.app.title,
        hours: mtConfig.sign.signUpActiveTokenExpires / (60 * 60 * 1000),
        url: appConfig.domain + '/api/auth/active/' + user.signUpActiveToken
      }, function (err, emailHTML) {
        if (err) {
          return res.status(400).send({
            message: 'SERVER.ACTIVE_MAIL_RENDER_ERROR'
          });
        } else {
          var mailOptions = {
            to: user.email,
            from: config.mailer.from,
            subject: 'Sign up account active of ' + config.app.title,
            html: emailHTML
          };
          smtpTransport.sendMail(mailOptions, function (err) {
            if (!err) {
              res.send({
                message: 'SERVER.SENDING_ACTIVE_MAIL_SUCCESSFULLY'
              });
            } else {
              return res.status(400).send({
                message: 'SERVER.SENDING_ACTIVE_MAIL_FAILED'
              });
            }

          });
        }
      });


      //create trace log
      traceLogCreate(req, traceConfig.action.userSignUp, {
        user: user._id,
        inviteToken: req.body.inviteToken || null,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      });
    }
  });
};

/**
 * active sign up from email token
 */
exports.active = function (req, res, next) {
  User.findOne({
    signUpActiveToken: req.params.token,
    status: 'inactive',
    signUpActiveExpires: {
      $gt: Date.now()
    }
  }, function (err, u) {
    if (err || !u) {
      return res.redirect('/authentication/active?method=invalid');
    } else {
      u.update({
        $set: {
          status: 'normal',
          signUpActiveToken: undefined,
          signUpActiveExpires: undefined
        }
      }).exec(function (err) {
        if (err) {
          return res.redirect('/authentication/active?method=error');
        } else {
          req.login(u, function (err) {
            if (err) {
              return res.redirect('/authentication/active?method=failed');
            } else {
              return res.redirect('/authentication/active?method=successfully');
            }
          });

          //create trace log
          traceLogCreate(req, traceConfig.action.userActiveAccount, {
            user: u._id,
            token: req.params.token
          });
        }
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(422).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (req, res, next) {
  var strategy = req.params.strategy;
  // Authenticate
  passport.authenticate(strategy)(req, res, next);
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (req, res, next) {
  var strategy = req.params.strategy;

  // info.redirect_to contains inteded redirect path
  passport.authenticate(strategy, function (err, user, info) {
    if (err) {
      return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
    }
    if (!user) {
      return res.redirect('/authentication/signin');
    }
    req.login(user, function (err) {
      if (err) {
        return res.redirect('/authentication/signin');
      }

      return res.redirect(info.redirect_to || '/');
    });
  })(req, res, next);
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  // Setup info and user objects
  var info = {};
  var user;

  // Set redirection path on session.
  // Do not redirect to a signin or signup page
  if (noReturnUrls.indexOf(req.session.redirect_to) === -1) {
    info.redirect_to = req.session.redirect_to;
  }

  // Define a search query fields
  var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
  var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

  // Define main provider search query
  var mainProviderSearchQuery = {};
  mainProviderSearchQuery.provider = providerUserProfile.provider;
  mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

  // Define additional provider search query
  var additionalProviderSearchQuery = {};
  additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

  // Define a search query to find existing user with current provider profile
  var searchQuery = {
    $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
  };

  // Find existing user with this provider account
  User.findOne(searchQuery, function (err, existingUser) {
    if (err) {
      return done(err);
    }

    if (!req.user) {
      if (!existingUser) {
        var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

        User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
          user = new User({
            firstName: providerUserProfile.firstName,
            lastName: providerUserProfile.lastName,
            username: availableUsername,
            displayName: providerUserProfile.displayName,
            profileImageURL: providerUserProfile.profileImageURL,
            provider: providerUserProfile.provider,
            providerData: providerUserProfile.providerData
          });

          // Email intentionally added later to allow defaults (sparse settings) to be applid.
          // Handles case where no email is supplied.
          // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
          user.email = providerUserProfile.email;
          user.passkey = user.randomAsciiString(32);

          // And save the user
          user.save(function (err) {
            return done(err, user, info);
          });
        });
      } else {
        return done(err, existingUser, info);
      }
    } else {
      // User is already logged in, join the provider data to the existing user
      user = req.user;

      // Check if an existing user was found for this provider account
      if (existingUser) {
        if (user.id !== existingUser.id) {
          return done(new Error('Account is already connected to another user'), user, info);
        }

        return done(new Error('User is already connected using this provider'), user, info);
      }

      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, info);
      });
    }
  });
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
