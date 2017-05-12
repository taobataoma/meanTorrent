'use strict';

/**
 * Module dependencies
 */
var comments = require('../controllers/comments.server.controller'),
  torrentsPolicy = require('../policies/torrents.server.policy');

module.exports = function (app) {
  app.route('/api/comments/:torrentId').all(torrentsPolicy.isAllowed)
    .post(comments.create);
  app.route('/api/comments/:torrentId/:commentId').all(torrentsPolicy.isAllowed)
    .post(comments.SubCreate)
    .put(comments.update)
    .delete(comments.delete);

  app.route('/api/comments/:torrentId/:commentId/:subCommentId').all(torrentsPolicy.isAllowed)
    .put(comments.SubUpdate)
    .delete(comments.SubDelete);
};
