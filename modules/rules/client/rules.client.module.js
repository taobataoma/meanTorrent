(function (app) {
  'use strict';

  app.registerModule('rules', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('rules.services');
  app.registerModule('rules.routes', ['ui.router', 'core.routes', 'rules.services']);
}(ApplicationConfiguration));
