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
      type: 'dropdown',
      roles: ['*'],
      position: 0
    });

    // Add the dropdown list item
    angular.forEach(torrentTypeConfig.value, function (cfg) {
      menuService.addSubMenuItem('topbar', 'torrents', {
        title: cfg.title,
        state: cfg.state,
        divider: cfg.divider,
        roles: ['*'],
        position: cfg.position
      });
    });
  }
}());
