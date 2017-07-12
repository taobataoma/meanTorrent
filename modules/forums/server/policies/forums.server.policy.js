'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Invitations Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow(
    [
      {
        roles: ['admin', 'oper', 'user'],
        allows: [
          {resources: '/api/forums', permissions: '*'},
          {resources: '/api/forums/:forumId', permissions: '*'},
          {resources: '/api/topics/:forumId', permissions: '*'},
          {resources: '/api/topics/:forumId/:topicId', permissions: '*'},
          {resources: '/api/topics/:forumId/:topicId/:replyId', permissions: '*'},
          {resources: '/api/topics/:forumId/:topicId/toggleTopicReadonly', permissions: '*'},
          {resources: '/api/topics/:forumId/:topicId/thumbsUp', permissions: '*'}
        ]
      },
      {
        roles: ['guest'],
        allows: [
          {resources: '/api/forums', permissions: ['get']},
          {resources: '/api/forums/:forumId', permissions: ['get']},
          {resources: '/api/topics/:forumId', permissions: ['get']},
          {resources: '/api/topics/:forumId/:topicId', permissions: ['get']},
          {resources: '/api/topics/:forumId/:topicId/:replyId', permissions: ['get']}
        ]
      }
    ]
  );
};

/**
 * Check If Invitations Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

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
