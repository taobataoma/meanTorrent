(function () {
  'use strict';

  angular
    .module('forums.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('forums', {
        url: '/forums',
        templateUrl: '/modules/forums/client/views/index.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.FORUM'
        }
      });
  }
}());
