'use strict';

/**
 * Module dependencies
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  //admin set single user
  app.route('/api/users/:userId/role')
    .post(adminPolicy.isAllowed, admin.updateUserRole);
  app.route('/api/users/:userId/status')
    .post(adminPolicy.isAllowed, admin.updateUserStatus);
  app.route('/api/users/:userId/score')
    .post(adminPolicy.isAllowed, admin.updateUserScore);
  app.route('/api/users/:userId/uploaded')
    .post(adminPolicy.isAllowed, admin.updateUserUploaded);
  app.route('/api/users/:userId/downloaded')
    .post(adminPolicy.isAllowed, admin.updateUserDownloaded);

  app.route('/api/users/:userId/seeding').all(adminPolicy.isAllowed)
    .get(admin.getUserSeeding);
  app.route('/api/users/:userId/leeching').all(adminPolicy.isAllowed)
    .get(admin.getUserLeeching);
  app.route('/api/users/:userId/warning').all(adminPolicy.isAllowed)
    .get(admin.getUserWarning);
  app.route('/api/users/:userId/uptotal').all(adminPolicy.isAllowed)
    .get(admin.getUserUploadedTotal);
  app.route('/api/users/:userId/resetImage').all(adminPolicy.isAllowed)
    .put(admin.resetUserProfileImage);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
