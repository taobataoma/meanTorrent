(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('torrents.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate'];

  function menuConfig(menuService, $translate) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: $translate.instant('MENU_TORRENTS_ADMIN'),
      state: 'admin.torrents.list',
      position: 1
    });
  }
}());
