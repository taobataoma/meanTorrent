'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  traceLogCreate = require(path.resolve('./config/lib/tracelog')).create;

var traceConfig = config.meanTorrentConfig.trace;
var backupConfig = config.meanTorrentConfig.backup;

var mtDebug = require(path.resolve('./config/lib/debug'));

/**
 * List of collections
 */
exports.list = function (req, res) {
  var files = fs.readdirSync(backupConfig.dir);
  const response = [];
  for (let file of files) {
    const fileInfo = fs.statSync(backupConfig.dir + file);
    response.push({
      name: file,
      size: fileInfo.size,
      ctime: fileInfo.ctime
    });
  }
  res.json(response);
};

/**
 * delete
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
  if (req.query.names) {
    if (Array.isArray(req.query.names)) {
      req.query.names.forEach(function (n) {
        var tfile = backupConfig.dir + n;
        fs.unlinkSync(tfile);
      });
    } else {
      var tfile = backupConfig.dir + req.query.names;
      fs.unlinkSync(tfile);
    }
    return res.status(200).send({
      message: 'delete successfully'
    });

  }
};
