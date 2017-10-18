(function (app) {
  'use strict';

  app.registerModule('about', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('about.admin', ['core.admin']);
  app.registerModule('about.admin.routes', ['core.admin.routes']);
  app.registerModule('about.services');
  app.registerModule('about.routes', ['ui.router', 'core.routes', 'about.services']);
}(ApplicationConfiguration));
