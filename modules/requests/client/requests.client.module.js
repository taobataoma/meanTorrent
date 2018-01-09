(function (app) {
  'use strict';

  app.registerModule('requests', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('requests.admin', ['core.admin']);
  app.registerModule('requests.admin.routes', ['core.admin.routes']);
  app.registerModule('requests.services');
  app.registerModule('requests.routes', ['ui.router', 'core.routes', 'requests.services']);
}(ApplicationConfiguration));
