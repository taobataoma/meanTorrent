(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate'];

  function menuConfig(menuService, $translate) {
    menuService.addMenuItem('topbar', {
      title: $translate.instant('MENU_ADMIN'),
      state: 'admin',
      type: 'dropdown',
      roles: ['admin'],
      position: 10
    });
  }
}());
