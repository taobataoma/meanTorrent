(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('systems.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_ADMIN_SYSTEMS',
      state: 'admin.systems.env',
      position: 1000,
      roles: ['admin'],
      divider: true
    });
  }
}());
