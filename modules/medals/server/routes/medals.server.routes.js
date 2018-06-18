'use strict';

/**
 * Module dependencies
 */
var medals = require('../controllers/medals.server.controller'),
  medalsPolicy = require('../policies/medals.server.policy');


module.exports = function (app) {
  app.route('/api/medals').all(medalsPolicy.isAllowed)
    .get(medals.getMedalsCount);

  app.route('/api/medals/view/:medalName').all(medalsPolicy.isAllowed)
    .get(medals.viewMedal);

  app.route('/api/medals/request/:medalName').all(medalsPolicy.isAllowed)
    .put(medals.requestMedal);

  app.route('/api/medals/:userId').all(medalsPolicy.isAllowed)
    .get(medals.getUserMedals);

  app.route('/api/medals/:userId/:medalName').all(medalsPolicy.isAllowed)
    .put(medals.addToUser)
    .delete(medals.removeFromUser);
};
