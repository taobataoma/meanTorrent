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

    //create trace log
    traceLogCreate(req, traceConfig.action.OperDeleteBackupFiles, {
      filename: req.query.names
    });

    return res.status(200).send({
      message: 'delete successfully'
    });

  }
};

/**
 * download
 * @param req
 * @param res
 */
exports.download = function (req, res) {
  var filePath = backupConfig.dir + req.params.filename;

  fs.exists(filePath, function (exists) {
    if (exists) {
      var stat = fs.statSync(filePath);
      //
      //try {
      //  res.set('Content-Type', 'application/octet-stream');
      //  res.set('Content-Disposition', 'attachment; filename=' + encodeURI(req.params.filename));
      //  res.set('Content-Length', stat.size);
      //
      //  fs.createReadStream(filePath).pipe(res);
      //} catch (err) {
      //  res.status(422).send({
      //    message: 'DOWNLOAD_FAILED'
      //  });
      //}

      var options = {
        root: path.join(__dirname, '../../../../' + backupConfig.dir),
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true,
          'Content-Disposition': 'attachment; filename=' + encodeURI(req.params.filename)
        }
      };

      res.sendFile(req.params.filename, options, function (err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
      });
    } else {
      res.status(422).send({
        message: 'FILE_DOES_NOT_EXISTS'
      });
    }
  });
};
