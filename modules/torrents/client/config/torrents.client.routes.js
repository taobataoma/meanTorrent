(function () {
  'use strict';

  angular
    .module('torrents.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', 'MeanTorrentConfigProvider'];

  function routeConfig($stateProvider, MeanTorrentConfigProvider) {
    var torrentTypeConfig = MeanTorrentConfigProvider.meanTorrentConfig().torrentType;

    $stateProvider
      .state('torrents', {
        abstract: true,
        url: '/torrents',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      });

    $stateProvider
      .state('torrents.uploads', {
        url: '/uploads',
        templateUrl: '/modules/torrents/client/views/uploads-torrents.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.UPLOAD'
        }
      });

    angular.forEach(torrentTypeConfig.value, function (cfg) {
      if (cfg.enable) {
        $stateProvider
          .state(cfg.state, {
            url: cfg.url,
            templateUrl: '/modules/torrents/client/views/torrent-list.client.view.html',
            data: {
              pageTitle: 'PAGETITLE.MOVIE_LIST',
              torrentType: cfg.value
            }
          });
      }
    });

    $stateProvider
      .state('torrents.view', {
        url: '/:torrentId',
        templateUrl: '/modules/torrents/client/views/view-torrent.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.TORRENT_INFO'
        }
      });
  }
}());
