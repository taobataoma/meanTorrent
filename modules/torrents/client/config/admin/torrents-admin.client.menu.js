(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('torrents.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_TORRENTS_ADMIN',
      state: 'admin.torrents',
      faIcon: 'fa-indent',
      faClass: 'fa-class-admin-torrents',
      position: 1
    });
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_UPLOADER_ADMIN',
      state: 'admin.uploader',
      roles: ['admin'],
      faIcon: 'fa-cloud-upload',
      faClass: 'fa-class-admin-upload',
      position: 2
    });

    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'MENU_TORRENTS_ADMIN_EDAU',
      state: 'admin.announce',
      position: 60,
      divider: true
    });
  }
}());
