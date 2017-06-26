(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('messages.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_ADMIN_MESSAGES',
      state: 'admin.messages',
      position: 10,
      divider: true
    });
  }
}());
