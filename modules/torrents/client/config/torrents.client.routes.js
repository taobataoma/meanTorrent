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
        url: '/uploads?reqId',
        templateUrl: '/modules/torrents/client/views/uploads-torrents.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.UPLOAD'
        }
      });

    $stateProvider
      .state('torrents.aggregate', {
        url: '/aggregate?keys',
        templateUrl: '/modules/torrents/client/views/list-torrents.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.TORRENTS_AGGREGATE',
          torrentType: 'aggregate'
        }
      });

    angular.forEach(torrentTypeConfig.value, function (cfg) {
      if (cfg.enable) {
        $stateProvider
          .state(cfg.state, {
            url: cfg.url,
            templateUrl: '/modules/torrents/client/views/list-torrents.client.view.html',
            data: {
              pageTitle: 'PAGETITLE.' + cfg.pageTitle,
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
