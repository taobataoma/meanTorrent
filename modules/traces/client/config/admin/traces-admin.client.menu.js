(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('torrents.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_ADMIN_TRACE',
      state: 'admin.traces',
      faIcon: 'fa-table',
      faClass: 'text-warning',
      position: 20
    });
  }
}());
