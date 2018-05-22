'use strict';

module.exports = function (app) {
  var check = require('../controllers/check.server.controller');

  app.route('/api/check').get(check.get);
  app.route('/api/check').put(check.check);
};
