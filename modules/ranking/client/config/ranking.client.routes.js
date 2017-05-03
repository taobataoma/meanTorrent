(function () {
  'use strict';

  angular
    .module('torrents.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ranking', {
        url: '/ranking',
        templateUrl: '/modules/ranking/client/views/ranking.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.RANKING'
        }
      });
  }
}());
