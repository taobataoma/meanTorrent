(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('forums.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_ADMIN_FORUMS_CONFIGURE',
      state: 'admin.forums.configure',
      faIcon: 'fa-bars',
      faClass: 'text-mt',
      position: 30
    });
  }
}());
