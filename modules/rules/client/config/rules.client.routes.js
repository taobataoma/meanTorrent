(function () {
  'use strict';

  angular
    .module('rules.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('rules', {
        url: '/rules',
        templateUrl: '/modules/rules/client/views/rules.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.RULES'
        }
      });
  }
}());
