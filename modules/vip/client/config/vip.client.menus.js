(function () {
  'use strict';

  angular
    .module('vip')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'MENU_VIP',
      state: 'vip',
      roles: ['*'],
      position: 6
    });
  }
}());
