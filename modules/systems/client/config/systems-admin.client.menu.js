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
      roles: ['admin'],
      faIcon: 'fa-cog',
      faClass: 'text-mt',
      position: 1000,
      divider: true
    });
  }
}());
