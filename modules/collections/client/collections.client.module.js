(function (app) {
  'use strict';

  app.registerModule('collections', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('collections.admin', ['core.admin']);
  app.registerModule('collections.admin.routes', ['core.admin.routes']);
  app.registerModule('collections.services');
  app.registerModule('collections.routes', ['ui.router', 'core.routes', 'collections.services']);
}(ApplicationConfiguration));
