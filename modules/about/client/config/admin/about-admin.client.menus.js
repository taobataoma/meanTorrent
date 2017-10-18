(function () {
  'use strict';

  angular
    .module('about.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_ADMIN_MAKERGROUP',
      state: 'admin.maker',
      position: 5,
      divider: true
    });

  }
}());
