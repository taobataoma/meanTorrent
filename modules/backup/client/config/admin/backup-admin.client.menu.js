(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('backup.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_ADMIN_BACKUP',
      state: 'admin.backup',
      position: 50,
      roles: ['admin'],
      divider: true
    });
  }
}());
