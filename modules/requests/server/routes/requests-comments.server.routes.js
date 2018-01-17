'use strict';

/**
 * Module dependencies
 */
var comments = require('../controllers/requests-comments.server.controller'),
  requestsPolicy = require('../policies/requests.server.policy');

module.exports = function (app) {
  app.route('/api/reqComments/:requestId').all(requestsPolicy.isAllowed)
    .post(comments.create);
  app.route('/api/reqComments/:requestId/:commentId').all(requestsPolicy.isAllowed)
    .post(comments.SubCreate)
    .put(comments.update)
    .delete(comments.delete);

  app.route('/api/reqComments/:requestId/:commentId/:subCommentId').all(requestsPolicy.isAllowed)
    .put(comments.SubUpdate)
    .delete(comments.SubDelete);
};
