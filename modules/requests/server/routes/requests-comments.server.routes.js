'use strict';

/**
 * Module dependencies
 */
var comments = require('../controllers/requests-comments.server.controller'),
  requestsPolicy = require('../policies/requests.server.policy');

module.exports = function (app) {
  app.route('/api/comments/:requestId').all(requestsPolicy.isAllowed)
    .post(comments.create);
  app.route('/api/comments/:requestId/:commentId').all(requestsPolicy.isAllowed)
    .post(comments.SubCreate)
    .put(comments.update)
    .delete(comments.delete);

  app.route('/api/comments/:requestId/:commentId/:subCommentId').all(requestsPolicy.isAllowed)
    .put(comments.SubUpdate)
    .delete(comments.SubDelete);
};
