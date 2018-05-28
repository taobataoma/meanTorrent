(function (app) {
  'use strict';

  app.registerModule('albums', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('albums.services');
  app.registerModule('albums.routes', ['ui.router', 'core.routes', 'albums.services']);
}(ApplicationConfiguration));
