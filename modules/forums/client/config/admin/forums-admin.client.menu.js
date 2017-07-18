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
      position: 30
    });
    //menuService.addSubMenuItem('topbar', 'admin', {
    //  title: 'MENU_ADMIN_FORUMS_MANAGEMENT',
    //  state: 'admin.forums.management',
    //  position: 31
    //});
  }
}());
