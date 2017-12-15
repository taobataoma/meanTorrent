'use strict';

var mongoose = require('mongoose'),
  Message = mongoose.model('Message');


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

    msg.save();
  }
};

