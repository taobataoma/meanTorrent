'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * List of Users
 */
exports.list = function (req, res) {
  var findUploadRanking = function (callback) {
    User.find({status: 'normal'}, '-salt -password -providerData')
      .sort('-uploaded -downloaded -ratio -score')
      .limit(20)
      .exec(function (err, users) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, users);
        }
      });
  };

  var findDownloadRanking = function (callback) {
    User.find({status: 'normal'}, '-salt -password -providerData')
      .sort('-downloaded -uploaded -ratio -score')
      .limit(20)
      .exec(function (err, users) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, users);
        }
      });
  };

  var findScoreRanking = function (callback) {
    User.find({status: 'normal'}, '-salt -password -providerData')
      .sort('-score -uploaded -downloaded -ratio')
      .limit(20)
      .exec(function (err, users) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, users);
        }
      });
  };

  var findRatioRanking = function (callback) {
    User.find({status: 'normal'}, '-salt -password -providerData')
      .sort('-ratio -uploaded -downloaded -score')
      .limit(20)
      .exec(function (err, users) {
        if (err) {
          callback(err, null);
        } else {
          var ru = [];
          users.forEach(function (u) {
            if (u.ratio < 0) {
              ru.push(u);
            }
          });
          users.forEach(function (u) {
            if (u.ratio >= 0) {
              ru.push(u);
            }
          });

          callback(null, ru);
        }
      });
  };

  async.parallel([findUploadRanking, findDownloadRanking, findScoreRanking, findRatioRanking], function (err, results) {
    if (err) {
      return res.status(422).send(err);
    } else {
      res.json({
        upload_ranking: results[0],
        download_ranking: results[1],
        score_ranking: results[2],
        ratio_ranking: results[3]
      });
    }
  });
};
