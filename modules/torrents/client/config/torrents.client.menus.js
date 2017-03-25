(function () {
  'use strict';

  angular
    .module('torrents')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate'];

  function menuConfig(menuService, $translate) {
    menuService.addMenuItem('topbar', {
      title: $translate.instant('MENU_TORRENTS'),
      state: 'torrents',
      type: 'dropdown',
      roles: ['*'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'torrents', {
      title: 'List torrents',
      state: 'torrents.list',
      roles: ['*']
    });
  }
}());
