'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
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
    trace.user = req.user ? req.user._id : (req.passkeyuser ? req.passkeyuser._id : null);
    trace.content = obj;

    trace.save(function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
};

