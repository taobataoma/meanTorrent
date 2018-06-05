(function (app) {
  'use strict';

  app.registerModule('dataLogs', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('dataLogs.admin', ['core.admin']);
  app.registerModule('dataLogs.admin.routes', ['core.admin.routes']);
  app.registerModule('dataLogs.services');
  app.registerModule('dataLogs.routes', ['ui.router', 'core.routes', 'dataLogs.services']);
}(ApplicationConfiguration));
