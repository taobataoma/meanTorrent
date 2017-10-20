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
      {resources: '/api/makers', permissions: '*'},
      {resources: '/api/makers/create/:userId', permissions: '*'},
      {resources: '/api/makers/:makerId', permissions: '*'},
      {resources: '/api/makers/:makerId/rating', permissions: '*'}
    ]
  }, {
    roles: ['user'],
    allows: [
      {resources: '/api/makers', permissions: ['get']},
      {resources: '/api/makers/:makerId', permissions: ['get']},
      {resources: '/api/makers/:makerId/rating', permissions: ['put']}
    ]
  }]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an article is being processed and the current user created it then allow any manipulation
  if (req.maker && req.user && req.maker.user && req.maker.user.id === req.user.id) {
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
