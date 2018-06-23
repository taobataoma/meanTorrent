(function (app) {
  'use strict';

  app.registerModule('favorites', ['core']);
  app.registerModule('favorites.admin', ['core.admin']);
  app.registerModule('favorites.admin.routes', ['core.admin.routes']);
  app.registerModule('favorites.services');
  app.registerModule('favorites.routes', ['ui.router', 'core.routes', 'favorites.services']);
}(ApplicationConfiguration));
