'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  logger = require('./logger'),
  mongoose = require('mongoose'),
  Trace = mongoose.model('Trace');

/**
 * createTrace
 * @param req
 * @param obj
 * @param callback
 * @returns {*}
 */
module.exports.create = function (req, action, obj) {
  if (action.enable) {
    var trace = new Trace();

    obj.action = action.name;

    if (req.user) {
      trace.user = req.user._id;
    } else if (req.passkeyuser) {
      trace.user = req.passkeyuser._id;
    } else {
      trace.user = null;
    }
    trace.content = obj;

    trace.save(function (err) {
      if (err) {
        logger.error(err);
      }
    });
  }
};

