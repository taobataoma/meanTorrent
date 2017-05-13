(function () {
  'use strict';

  angular
    .module('torrents.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('torrents', {
        abstract: true,
        url: '/torrents',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('torrents.movie', {
        url: '/movie',
        templateUrl: '/modules/torrents/client/views/movie-list.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.MOVIE_LIST'
        }
      })
      .state('torrents.uploads', {
        url: '/uploads',
        templateUrl: '/modules/torrents/client/views/uploads-torrents.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.UPLOAD'
        }
      })
      .state('torrents.view', {
        url: '/:torrentId',
        templateUrl: '/modules/torrents/client/views/view-torrent.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.TORRENT_INFO'
        }
      });
  }
}());
