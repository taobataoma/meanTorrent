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
        templateUrl: '/modules/collections/client/views/collections.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.COLLECTIONS'
        }
      });
  }
}());
