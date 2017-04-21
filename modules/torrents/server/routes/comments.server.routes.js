'use strict';

/**
 * Module dependencies
 */
var comments = require('../controllers/comments.server.controller');

module.exports = function (app) {
  app.route('/api/comments/:torrentId')
    .get(comments.list)
    .post(comments.create);
  app.route('/api/comments/:torrentId/:commentId')
    .get(comments.SubList)
    .post(comments.SubCreate)
    .put(comments.update)
    .delete(comments.delete);

  app.route('/api/comments/:torrentId/:commentId/:subCommentId')
    .put(comments.SubUpdate)
    .delete(comments.SubDelete);
};
