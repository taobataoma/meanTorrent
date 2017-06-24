'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  nodemailer = require('nodemailer'),
  User = mongoose.model('User'),
  Invitation = mongoose.model('Invitation'),
  async = require('async'),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var smtpTransport = nodemailer.createTransport(config.mailer.options);
var traceConfig = config.meanTorrentConfig.trace;

/**
 * create a Invitation
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  var invitation = new Invitation();
  invitation.expiresat = Date.now() + config.meanTorrentConfig.invite.expires;
  invitation.user = req.user;
  invitation.token = req.user.randomAsciiString(32);

  invitation.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //res.json(invitation);
      var user = req.user;
      user.update({
        $set: {score: user.score - config.meanTorrentConfig.invite.score_exchange}
      }).exec(function (err, result) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          user.score = user.score - config.meanTorrentConfig.invite.score_exchange;
          res.json(user);

          //create trace log
          traceLogCreate(req, traceConfig.action.userInvitationExchange, {
            user: req.user._id,
            token: invitation.token,
            score: config.meanTorrentConfig.invite.score_exchange
          });
        }
      });

    }
  });
};


/**
 * List of Invitations
 */
exports.list = function (req, res) {
  var findMyInvitations = function (callback) {
    Invitation.find({
      user: req.user._id,
      status: 0,
      expiresat: {$gt: Date.now()}
    })
      .sort('createdat')
      .populate('user')
      .exec(function (err, invitations) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, invitations);
        }
      });
  };

  var findUsedInvitations = function (callback) {
    Invitation.find({
      user: req.user._id,
      status: {$gt: 0}
    })
      .sort('invitedat')
      .populate('user')
      .populate('to_user')
      .exec(function (err, invitations) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, invitations);
        }
      });
  };

  async.parallel([findMyInvitations, findUsedInvitations], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({
        my_invitations: results[0],
        used_invitations: results[1]
      });
    }
  });
};

/**
 * Update an invitation
 */
exports.update = function (req, res) {
  var invitation = req.invitation;

  var countRegisteredEmail = function (callback) {
    User.count({email: req.query.to_email}, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };
  var countInvitedEmail = function (callback) {
    Invitation.count({to_email: req.query.to_email}, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  async.parallel([countRegisteredEmail, countInvitedEmail], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      if (results[0] > 0) {
        return res.status(422).send({message: 'EMAIL_ALREADY_REGISTERED'});
      } else if (results[1] > 0) {
        return res.status(422).send({message: 'EMAIL_ALREADY_EXIST'});
      } else {
        var httpTransport = 'http://';
        if (config.secure && config.secure.ssl === true) {
          httpTransport = 'https://';
        }
        var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
        res.render(path.resolve('modules/invitations/server/templates/invite-sign-up-email'), {
          to_email: req.query.to_email,
          name: req.user.displayName,
          appName: config.app.title,
          url: baseUrl + '/api/auth/invite/' + invitation.token,
          hours: config.meanTorrentConfig.invite.expires / (60 * 60 * 1000)
        }, function (err, emailHTML) {
          if (err) {
            return res.status(422).send({message: 'INVITE_MAIL_RENDER_FAILED'});
          } else {
            var mailOptions = {
              to: req.query.to_email,
              from: config.mailer.from,
              subject: config.app.title + ' invitation',
              html: emailHTML
            };
            smtpTransport.sendMail(mailOptions, function (err) {
              if (err) {
                return res.status(422).send({message: 'INVITE_MAIL_SEND_FAILED'});
              } else {
                invitation.to_email = req.query.to_email;
                invitation.status = 1;
                invitation.invitedat = Date.now();
                invitation.expiresat = Date.now() + config.meanTorrentConfig.invite.expires;

                invitation.save(function (err) {
                  if (err) {
                    return res.status(422).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    res.json(invitation);
                  }
                });
              }
            });
          }
        });
      }
    }
  });
};

/**
 * Delete an invitation
 */
exports.delete = function (req, res) {
  var invitation = req.invitation;

  invitation.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(invitation);
    }
  });
};

/**
 * verifyToken
 * @param req
 * @param res
 */
exports.verifyToken = function (req, res) {
  var t = req.params.token;

  Invitation.findOne({token: t}).exec(function (err, invitation) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!invitation) {
      return res.status(404).send({
        message: 'No invitation with that token has been found'
      });
    }
    res.json(invitation);
  });

};

/**
 * countInvitations
 * @param req
 * @param res
 */
exports.countInvitations = function (req, res) {
  var countMyInvitations = function (callback) {
    Invitation.count({
      user: req.user._id,
      status: 0,
      expiresat: {$gt: Date.now()}
    }, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };
  var countUsedInvitations = function (callback) {
    Invitation.count({
      user: req.user._id,
      status: 2
    }, function (err, count) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, count);
      }
    });
  };

  async.parallel([countMyInvitations, countUsedInvitations], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({
        countMyInvitations: results[0],
        countUsedInvitations: results[1]
      });
    }
  });
};

/**
 * Invitation middleware
 */
exports.invitationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Invitation is invalid'
    });
  }

  Invitation.findById(id).populate('user').exec(function (err, invitation) {
    if (err) {
      return next(err);
    } else if (!invitation) {
      return res.status(404).send({
        message: 'No invitation with that identifier has been found'
      });
    }
    req.invitation = invitation;
    next();
  });
};

