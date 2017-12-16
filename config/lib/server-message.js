'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Message = mongoose.model('Message');

var mtDebug = require(path.resolve('./config/lib/debug'));

module.exports.addMessage = function (uid, title, content, params) {
  if (uid && mongoose.Types.ObjectId.isValid(uid)) {
    var nc = {
      string: content,
      params: params
    };

    var msg = new Message({
      from_user: undefined,
      to_user: uid,
      title: title,
      content: JSON.stringify(nc),
      type: 'server',
      from_status: 1,
      to_status: 0
    });

    mtDebug.debugGreen(msg);

    msg.save();
  }
};

