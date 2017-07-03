(function (app) {
  'use strict';

  app.registerModule('forums', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('forums.admin', ['core.admin']);
  app.registerModule('forums.admin.routes', ['core.admin.routes']);
  app.registerModule('forums.services');
  app.registerModule('forums.routes', ['ui.router', 'core.routes', 'forums.services']);
}(ApplicationConfiguration));
