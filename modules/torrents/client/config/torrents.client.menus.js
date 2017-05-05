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
      title: 'MENU_TORRENTS_SUB.SUB_MOVIE',
      state: 'torrents.movie',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'torrents', {
      title: 'MENU_TORRENTS_SUB.SUB_MTV',
      state: 'torrents.mtv',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'torrents', {
      title: 'MENU_TORRENTS_SUB.SUB_MUSIC',
      state: 'torrents.music',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'torrents', {
      title: 'MENU_TORRENTS_SUB.SUB_OTHER',
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
