(function () {
  'use strict';

  angular
    .module('users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_USERS_ADMIN',
      state: 'admin.users',
      target: '_blank'
    });
  }
}());
