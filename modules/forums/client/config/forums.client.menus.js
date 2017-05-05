(function () {
  'use strict';

  angular
    .module('forums')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'MENU_FORUMS',
      state: 'forums',
      roles: ['*'],
      position: 1
    });
  }
}());
