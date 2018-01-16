'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['oper', 'admin'],
    allows: [
      {resources: '/api/requests', permissions: '*'},
      {resources: '/api/requests/:requestId', permissions: '*'},
      {resources: '/api/requests/:requestId/accept/:torrentId', permissions: '*'},

      {resources: '/api/comments/:requestId', permissions: '*'},
      {resources: '/api/comments/:requestId/:commentId', permissions: '*'},
      {resources: '/api/comments/:requestId/:commentId/:subCommentId', permissions: '*'}
    ]
  }, {
    roles: ['user'],
    allows: [
      {resources: '/api/requests', permissions: '*'},
      {resources: '/api/requests/:requestId', permissions: '*'},
      {resources: '/api/requests/:requestId/accept/:torrentId', permissions: '*'},

      {resources: '/api/comments/:requestId', permissions: ['post']},
      {resources: '/api/comments/:requestId/:commentId', permissions: ['post', 'put', 'delete']},
      {resources: '/api/comments/:requestId/:commentId/:subCommentId', permissions: ['put', 'delete']}
    ]
  }]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an article is being processed and the current user created it then allow any manipulation
  if (req.request && req.user && req.request.user && req.request.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
