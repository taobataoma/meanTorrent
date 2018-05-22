(function (app) {
  'use strict';

  app.registerModule('check', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('check.admin', ['core.admin']);
  app.registerModule('check.admin.routes', ['core.admin.routes']);
  app.registerModule('check.services');
  app.registerModule('check.routes', ['ui.router', 'core.routes', 'check.services']);
}(ApplicationConfiguration));
