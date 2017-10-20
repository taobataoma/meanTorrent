'use strict';

/**
 * Module dependencies
 */
var aboutPolicy = require('../policies/about.server.policy'),
  maker = require('../controllers/makers.server.controller');

module.exports = function (app) {
  app.route('/api/makers').all(aboutPolicy.isAllowed)
    .get(maker.list);

  app.route('/api/makers/create/:userId').all(aboutPolicy.isAllowed)
    .post(maker.create);

  app.route('/api/makers/:makerId').all(aboutPolicy.isAllowed)
    .get(maker.read)
    .put(maker.update)
    .delete(maker.delete);

  app.route('/api/makers/:makerId/rating').all(aboutPolicy.isAllowed)
    .put(maker.rating);

  app.param('makerId', maker.makerByID);
};
