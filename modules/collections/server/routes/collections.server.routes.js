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

  app.route('/api/collections').all(collectionsPolicy.isAllowed)
    .get(collections.list)
    .post(collections.create);

  app.route('/api/collections/:collectionId').all(collectionsPolicy.isAllowed)
    .get(collections.read)
    .put(collections.update)
    .delete(collections.delete);

  app.route('/api/collections/:collectionId/insert/:torrentId').all(collectionsPolicy.isAllowed)
    .put(collections.insertIntoCollection);
  app.route('/api/collections/:collectionId/remove/:torrentId').all(collectionsPolicy.isAllowed)
    .put(collections.removeFromCollection);
  app.route('/api/collections/:collectionId/set/recommendlevel/:rlevel').all(collectionsPolicy.isAllowed)
    .put(collections.setRecommendLevel);

  app.param('collectionId', collections.collectionByID);
};
