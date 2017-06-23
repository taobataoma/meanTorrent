(function (app) {
  'use strict';

  app.registerModule('traces', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('traces.admin', ['core.admin']);
  app.registerModule('traces.admin.routes', ['core.admin.routes']);
  app.registerModule('traces.services');
  app.registerModule('traces.routes', ['ui.router', 'core.routes', 'traces.services']);
}(ApplicationConfiguration));
