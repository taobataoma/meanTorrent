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
      target: '_blank',
      position: 1
    });
  }
}());
