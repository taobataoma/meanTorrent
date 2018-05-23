'use strict';

/**
 * Module dependencies
 */
var albums = require('../controllers/albums.server.controller'),
  albumsPolicy = require('../policies/albums.server.policy');


module.exports = function (app) {
  app.route('/api/albums').all(albumsPolicy.isAllowed)
    .get(albums.list)
    .post(albums.create);

  app.route('/api/albums/:albumId').all(albumsPolicy.isAllowed)
    .get(albums.read)
    .put(albums.update)
    .delete(albums.delete);

  app.route('/api/albums/:albumId/insert/:torrentId').all(albumsPolicy.isAllowed)
    .put(albums.insertIntoAlbum);
  app.route('/api/albums/:albumId/remove/:torrentId').all(albumsPolicy.isAllowed)
    .put(albums.removeFromAlbum);
  app.route('/api/albums/:albumId/set/recommendlevel/:rlevel').all(albumsPolicy.isAllowed)
    .put(albums.setRecommendLevel);
  app.route('/api/albums/:albumId/toggleHomeItemStatus').all(albumsPolicy.isAllowed)
    .put(albums.toggleHomeItemStatus);

  app.param('albumId', albums.albumByID);
};
