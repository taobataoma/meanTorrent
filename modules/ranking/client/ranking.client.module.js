(function (app) {
  'use strict';

  app.registerModule('ranking', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('ranking.services');
  app.registerModule('ranking.routes', ['ui.router', 'core.routes', 'ranking.services']);
}(ApplicationConfiguration));
