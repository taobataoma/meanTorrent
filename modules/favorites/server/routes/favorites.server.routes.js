'use strict';

/**
 * Module dependencies
 */
var favorites = require('../controllers/favorites.server.controller'),
  favoritesPolicy = require('../policies/favorites.server.policy');


module.exports = function (app) {
  app.route('/api/favorites').all(favoritesPolicy.isAllowed)
    .get(favorites.list);

  app.route('/api/favorites/add/:torrentId').all(favoritesPolicy.isAllowed)
    .post(favorites.create);

  app.route('/api/favorites/:favoriteId').all(favoritesPolicy.isAllowed)
    .delete(favorites.delete);

  app.param('favoriteId', favorites.favoriteById);
};
