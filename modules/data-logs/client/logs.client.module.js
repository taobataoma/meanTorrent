(function (app) {
  'use strict';

  app.registerModule('logs', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('logs.admin', ['core.admin']);
  app.registerModule('logs.admin.routes', ['core.admin.routes']);
  app.registerModule('logs.services');
  app.registerModule('logs.routes', ['ui.router', 'core.routes', 'logs.services']);
}(ApplicationConfiguration));
