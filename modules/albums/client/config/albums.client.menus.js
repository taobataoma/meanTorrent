(function () {
  'use strict';

  angular
    .module('albums')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'MENU_ALBUMS',
      state: 'albums.list',
      roles: ['*'],
      position: 1
    });
  }
}());
