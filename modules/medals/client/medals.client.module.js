(function (app) {
  'use strict';

  app.registerModule('medals', ['core']);
  app.registerModule('medals.admin', ['core.admin']);
  app.registerModule('medals.admin.routes', ['core.admin.routes']);
  app.registerModule('medals.services');
  app.registerModule('medals.routes', ['ui.router', 'core.routes', 'medals.services']);
}(ApplicationConfiguration));
