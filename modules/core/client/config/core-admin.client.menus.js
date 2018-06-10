(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'MENU_ADMIN',
      state: 'admin',
      type: 'dropdown',
      roles: ['oper', 'admin'],
      position: 10,
      shouldDotClass: 'header-dot-class-admin'
    });
  }
}());
