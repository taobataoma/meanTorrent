(function () {
  'use strict';

  angular
    .module('collections.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_ADMIN_COLLECTIONS',
      state: 'admin.collections',
      position: 5,
      divider: true
    });

  }
}());
