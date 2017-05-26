(function () {
  'use strict';

  angular
    .module('torrents')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'MENU_TORRENTS',
      state: 'torrents',
      type: 'dropdown',
      roles: ['*'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'torrents', {
      title: 'MENU_TORRENTS_SUB.MOVIE',
      state: 'torrents.movie',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'torrents', {
      title: 'MENU_TORRENTS_SUB.TVSERIAL',
      state: 'torrents.tvserial',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'torrents', {
      title: 'MENU_TORRENTS_SUB.MUSIC',
      state: 'torrents.music',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'torrents', {
      title: 'MENU_TORRENTS_SUB.OTHER',
      state: 'torrents.other',
      roles: ['*']
    });
    menuService.addMenuItem('topbar', {
      title: 'MENU_UPLOAD',
      state: 'torrents.uploads',
      roles: ['*'],
      position: 3
    });
  }
}());
