(function (app) {
  'use strict';

  app.registerModule('systems', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('systems.admin', ['core.admin']);
  app.registerModule('systems.admin.routes', ['core.admin.routes']);
  app.registerModule('systems.services');
  app.registerModule('systems.routes', ['ui.router', 'core.routes', 'systems.services']);
}(ApplicationConfiguration));
