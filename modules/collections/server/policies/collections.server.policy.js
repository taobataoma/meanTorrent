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
          {resources: '/api/search/collection/:language', permissions: '*'},
          {resources: '/api/collectionInfo/:id/:language', permissions: '*'},
          {resources: '/api/collections', permissions: '*'},
          {resources: '/api/collections/:collectionId', permissions: '*'}
        ]
      },
      {
        roles: ['user'],
        allows: [
          {resources: '/api/search/collection/:language', permissions: ['get']},
          {resources: '/api/collectionInfo/:id/:language', permissions: ['get']},
          {resources: '/api/collections', permissions: ['get']},
          {resources: '/api/collections/:collectionId', permissions: ['get']}
        ]
      },
      {
        roles: ['guest'],
        allows: [
          {resources: '/api/search/collection/:language', permissions: ['get']},
          {resources: '/api/collectionInfo/:id/:language', permissions: ['get']},
          {resources: '/api/collections', permissions: ['get']},
          {resources: '/api/collections/:collectionId', permissions: ['get']}
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
