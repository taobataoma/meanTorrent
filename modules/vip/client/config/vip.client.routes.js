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
        abstract: true,
        template: '<ui-view/>'
      })
      .state('vip.list', {
        url: '',
        templateUrl: '/modules/vip/client/views/vip.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          rolesStateTo: 'vip.rules',
          pageTitle: 'PAGETITLE.VIP'
        }
      })
      .state('vip.rules', {
        url: '/rules',
        templateUrl: '/modules/vip/client/views/rules.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.VIP_RULES'
        }
      })
      .state('vip.donate', {
        url: '/donate',
        templateUrl: '/modules/vip/client/views/donate.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.VIP_DONATE'
        }
      });
  }
}());
