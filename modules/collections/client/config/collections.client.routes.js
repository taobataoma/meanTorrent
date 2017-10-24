(function () {
  'use strict';

  angular
    .module('collections.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {

    $stateProvider
      // this menu item defined in torrents menu config
      .state('collections', {
        url: '/collections',
        abstract: true,
        template: '<ui-view/>',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('collections.list', {
        url: '',
        templateUrl: '/modules/collections/client/views/collections.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.COLLECTIONS'
        }
      })
      .state('collections.view', {
        url: '/:collectionId',
        templateUrl: '/modules/collections/client/views/collection-view.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.COLLECTIONS'
        }
      });
  }
}());
