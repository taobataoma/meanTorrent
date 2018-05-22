(function () {
  'use strict';

  angular
    .module('torrents')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', 'MeanTorrentConfig'];

  function menuConfig(menuService, MeanTorrentConfig) {
    var torrentTypeConfig = MeanTorrentConfig.meanTorrentConfig.torrentType;

    menuService.addMenuItem('topbar', {
      title: 'MENU_TORRENTS',
      state: 'torrents',
      linkState: 'torrents.aggregate',
      type: 'dropdown',
      roles: ['*'],
      position: 0
    });

    menuService.addMenuItem('topbar', {
      title: 'MENU_UPLOAD',
      state: 'torrents.uploads',
      roles: ['*'],
      position: 3
    });

    // menuService.addSubMenuItem('topbar', 'torrents', {
    //   title: 'MENU_TORRENTS_SUB.AGGREGATE',
    //   state: 'torrents.aggregate',
    //   roles: ['*'],
    //   faIcon: 'fa-ellipsis-h',
    //   faClass: 'text-mt',
    //   position: 0
    // });

    // Add the dropdown list item
    angular.forEach(torrentTypeConfig.value, function (cfg) {
      if (cfg.enable && cfg.role === 'user') {
        menuService.addSubMenuItem('topbar', 'torrents', {
          title: cfg.title,
          state: cfg.state,
          divider: cfg.divider,
          roles: ['*'],
          faIcon: cfg.faIcon,
          faClass: cfg.faClass,
          position: cfg.position
        });

        if (cfg.value === 'movie') {
          menuService.addSubMenuItem('topbar', 'torrents', {
            title: 'MENU_TORRENTS_SUB.MOVIE_COLLECTIONS',
            state: 'collections.list',
            roles: ['*'],
            faIcon: 'fa-sitemap',
            faClass: 'text-mt',
            position: cfg.position
          });
        }
      }
    });
  }
}());
