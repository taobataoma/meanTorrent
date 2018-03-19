(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('invitations.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_ADMIN_OFFICIAL_INVITATION',
      state: 'admin.invitations.official',
      faIcon: 'fa-user-plus',
      faClass: 'text-mt',
      position: 40
    });
  }
}());
