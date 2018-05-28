(function () {
  'use strict';

  angular
    .module('albums.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {

    $stateProvider
      // this menu item defined in torrents menu config
      .state('albums', {
        url: '/albums',
        abstract: true,
        template: '<ui-view/>',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('albums.list', {
        url: '',
        templateUrl: '/modules/albums/client/views/albums.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.ALBUMS'
        }
      })
      .state('albums.view', {
        url: '/:albumId',
        templateUrl: '/modules/albums/client/views/album-view.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.ALBUMS'
        }
      });
  }
}());
