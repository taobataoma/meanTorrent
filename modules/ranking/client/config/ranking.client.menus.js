(function () {
  'use strict';

  angular
    .module('ranking')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'about', {
      title: 'MENU_ABOUT_RANKING',
      state: 'ranking',
      position: 2,
      divider: true
    });
  }
}());
