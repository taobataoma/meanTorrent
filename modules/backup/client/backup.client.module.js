(function (app) {
  'use strict';

  app.registerModule('backup', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('backup.admin', ['core.admin']);
  app.registerModule('backup.admin.routes', ['core.admin.routes']);
  app.registerModule('backup.services');
  app.registerModule('backup.routes', ['ui.router', 'core.routes', 'backup.services']);
}(ApplicationConfiguration));
