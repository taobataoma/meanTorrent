'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Torrents Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow(
    [
      {
        roles: ['admin', 'oper'],
        allows: [
          {resources: '/api/albums', permissions: '*'},
          {resources: '/api/albums/:albumId', permissions: '*'},
          {resources: '/api/albums/:albumId/insert/:torrentId', permissions: '*'},
          {resources: '/api/albums/:albumId/remove/:torrentId', permissions: '*'},
          {resources: '/api/albums/:albumId/set/recommendlevel/:rlevel', permissions: '*'}
        ]
      },
      {
        roles: ['user'],
        allows: [
          {resources: '/api/albums', permissions: ['get']},
          {resources: '/api/albums/:albumId', permissions: ['get']}
        ]
      },
      {
        roles: ['guest'],
        allows: [
          {resources: '/api/albums', permissions: ['get']},
          {resources: '/api/albums/:albumId', permissions: ['get']}
        ]
      }
    ]
  );
};

/**
 * Check If Articles Policy Allows
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
