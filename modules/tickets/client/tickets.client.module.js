(function (app) {
  'use strict';

  app.registerModule('tickets', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('tickets.admin', ['core.admin']);
  app.registerModule('tickets.admin.routes', ['core.admin.routes']);
  app.registerModule('tickets.services');
  app.registerModule('tickets.routes', ['ui.router', 'core.routes', 'tickets.services']);
}(ApplicationConfiguration));
