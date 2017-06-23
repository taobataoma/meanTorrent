(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('torrents.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_TORRENTS_ADMIN',
      state: 'admin.torrents',
      position: 1
    });

    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_TORRENTS_ADMIN_EDAU',
      state: 'admin.announce',
      position: 2,
      divider: true
    });
  }
}());
