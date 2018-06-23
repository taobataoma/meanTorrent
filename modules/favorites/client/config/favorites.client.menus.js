(function () {
  'use strict';

  angular
    .module('favorites')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenu('mt-favorite', {
      roles: ['user']
    });

    menuService.addMenuItem('mt-favorite', {
      title: 'MENU_MY_FAVORITE',
      state: 'favorites.list',
      faIcon: 'fa-shopping-cart',
      faClass: 'text-mt'
    });
  }
}());
