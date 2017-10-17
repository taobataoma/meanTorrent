(function () {
  'use strict';

  angular
    .module('vip.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('vip', {
        url: '/vip',
        templateUrl: '/modules/vip/client/views/vip.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.VIP'
        }
      });
  }
}());
