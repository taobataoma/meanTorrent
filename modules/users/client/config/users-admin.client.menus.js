(function () {
  'use strict';

  angular
    .module('users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate'];

  // Configuring the Users module
  function menuConfig(menuService, $translate) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: $translate.instant('MENU_USERS_ADMIN'),
      state: 'admin.users'
    });
  }
}());
