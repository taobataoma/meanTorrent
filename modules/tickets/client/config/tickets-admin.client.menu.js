(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('tickets.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_ADMIN_TICKETS',
      state: 'admin.tickets.support.message',
      faIcon: 'fa-phone-volume',
      faClass: 'text-mt',
      position: 70,
      divider: true,
      shouldBadgeClass: 'badge-class-admin-tickets'
    });
  }
}());
