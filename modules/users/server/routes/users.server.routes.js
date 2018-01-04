'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/passkey').post(users.resetPasskey);
  app.route('/api/users/unIdle').post(users.unIdle);
  app.route('/api/users/warningNumber').get(users.warningNumber);
  app.route('/api/users/picture').post(users.changeProfilePicture);
  app.route('/api/users/signature').post(users.changeSignature);
  app.route('/api/users/followTo/:userId').post(users.followTo);
  app.route('/api/users/unFollowTo/:userId').post(users.unFollowTo);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
