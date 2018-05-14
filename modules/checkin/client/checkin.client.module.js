(function (app) {
  'use strict';

  app.registerModule('checkin', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('checkin.admin', ['core.admin']);
  app.registerModule('checkin.admin.routes', ['core.admin.routes']);
  app.registerModule('checkin.services');
  app.registerModule('checkin.routes', ['ui.router', 'core.routes', 'checkin.services']);
}(ApplicationConfiguration));
