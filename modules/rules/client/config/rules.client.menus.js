(function () {
  'use strict';

  angular
    .module('rules')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'MENU_RULES',
      state: 'rules',
      roles: ['*'],
      class: 'sm-hide',
      position: 5
    });
  }
}());
