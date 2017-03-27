(function () {
  'use strict';

  angular
    .module('torrents')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate'];

  function menuConfig(menuService, $translate) {
    menuService.addMenuItem('topbar', {
      title: $translate.instant('MENU_TORRENTS'),
      state: 'torrents',
      type: 'dropdown',
      roles: ['*'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'torrents', {
      title: $translate.instant('MENU_TORRENTS_SUB.SUB_MOVIE'),
      state: 'torrents.movie',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'torrents', {
      title: $translate.instant('MENU_TORRENTS_SUB.SUB_MTV'),
      state: 'torrents.mtv',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'torrents', {
      title: $translate.instant('MENU_TORRENTS_SUB.SUB_MUSIC'),
      state: 'torrents.music',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'torrents', {
      title: $translate.instant('MENU_TORRENTS_SUB.SUB_OTHER'),
      state: 'torrents.other',
      roles: ['*']
    });

    menuService.addMenuItem('topbar', {
      title: $translate.instant('MENU_UPLOADS'),
      state: 'torrents.uploads',
      roles: ['*'],
      position: 3
    });

    menuService.addMenuItem('topbar', {
      title: $translate.instant('MENU_RANKING'),
      state: 'torrents.ranking',
      roles: ['*'],
      position: 4
    });

    menuService.addMenuItem('topbar', {
      title: $translate.instant('MENU_RULES'),
      state: 'torrents.rules',
      roles: ['*'],
      position: 5
    });

    menuService.addMenuItem('topbar', {
      title: $translate.instant('MENU_VIP'),
      state: 'torrents.vip',
      roles: ['*'],
      position: 6
    });

  }
}());
