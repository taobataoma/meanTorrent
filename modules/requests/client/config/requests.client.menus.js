(function () {
  'use strict';

  angular
    .module('requests')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'MENU_REQUESTS',
      state: 'requests.list',
      roles: ['*'],
      position: 6
    });
  }
}());
