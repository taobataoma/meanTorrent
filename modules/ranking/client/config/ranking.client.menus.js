(function () {
  'use strict';

  angular
    .module('ranking')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'MENU_RANKING',
      state: 'ranking',
      roles: ['*'],
      class: 'sm-hide',
      position: 4
    });
  }
}());
