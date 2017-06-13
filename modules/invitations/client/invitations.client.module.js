(function (app) {
  'use strict';

  app.registerModule('invitations', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('invitations.admin', ['core.admin']);
  app.registerModule('invitations.admin.routes', ['core.admin.routes']);
  app.registerModule('invitations.services');
  app.registerModule('invitations.routes', ['ui.router', 'core.routes', 'invitations.services']);
}(ApplicationConfiguration));
