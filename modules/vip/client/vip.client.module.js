(function (app) {
  'use strict';

  app.registerModule('vip', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('vip.services');
  app.registerModule('vip.routes', ['ui.router', 'core.routes', 'vip.services']);
}(ApplicationConfiguration));
