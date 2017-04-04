(function (app) {
  'use strict';

  app.registerModule('torrents', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('torrents.admin', ['core.admin']);
  app.registerModule('torrents.admin.routes', ['core.admin.routes']);
  app.registerModule('torrents.services');
  app.registerModule('torrents.routes', ['ui.router', 'core.routes', 'torrents.services']);
}(ApplicationConfiguration));
