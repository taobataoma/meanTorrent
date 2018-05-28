'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow(
    [
      {
        roles: ['admin'],
        allows: [
          {resources: '/api/users/uploaderList', permissions: '*'},
          {resources: '/api/users/:userId/role', permissions: '*'},
          {resources: '/api/users/:userId/VIPMonths/:months', permissions: '*'},
          {resources: '/api/users/:userId/VIPMonths/reset', permissions: '*'},
          {resources: '/api/users/:userId/presentInvitations', permissions: '*'}
        ]
      },
      {
        roles: ['oper', 'admin'],
        allows: [
          {resources: '/api/users', permissions: '*'},
          {resources: '/api/users/:userId', permissions: '*'},
          {resources: '/api/users/:userId/status', permissions: '*'},
          {resources: '/api/users/:userId/score', permissions: '*'},
          {resources: '/api/users/:userId/uploaded', permissions: '*'},
          {resources: '/api/users/:userId/downloaded', permissions: '*'},
          {resources: '/api/users/:userId/seeding', permissions: '*'},
          {resources: '/api/users/:userId/leeching', permissions: '*'},
          {resources: '/api/users/:userId/warning', permissions: '*'},
          {resources: '/api/users/:userId/uptotal', permissions: '*'},
          {resources: '/api/users/:userId/followers', permissions: '*'},
          {resources: '/api/users/:userId/following', permissions: '*'},
          {resources: '/api/users/:userId/resetImage', permissions: '*'}
        ]
      },
      {
        roles: ['user'],
        allows: [
          {resources: '/api/users/:userId', permissions: ['get']},
          {resources: '/api/users/:userId/uptotal', permissions: ['get']},
          {resources: '/api/users/:userId/followers', permissions: ['get']},
          {resources: '/api/users/:userId/following', permissions: ['get']}
        ]
      }
    ]
  );
};

/**
 * Check If Admin Policy Allows
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
