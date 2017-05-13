(function () {
  'use strict';

  angular
    .module('ranking.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ranking', {
        url: '/ranking',
        templateUrl: '/modules/ranking/client/views/ranking.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.RANKING'
        }
      });
  }
}());
