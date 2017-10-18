'use strict';

/**
 * Module dependencies
 */
var collections = require('../controllers/collections.server.controller'),
  collectionsPolicy = require('../policies/collections.server.policy');


module.exports = function (app) {
  app.route('/api/search/collection/:language').all(collectionsPolicy.isAllowed)
    .get(collections.searchcollection);
  app.route('/api/collectionInfo/:id/:language').all(collectionsPolicy.isAllowed)
    .get(collections.collectioninfo);

  app.param('collectionId', collections.collectionByID);
};
