(function () {
  'use strict';

  angular
    .module('requests.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('requests', {
        abstract: true,
        url: '/requests',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('requests.list', {
        url: '/list',
        templateUrl: '/modules/requests/client/views/requests-list.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.REQUESTS'
        }
      })
      .state('requests.my', {
        url: '/my',
        templateUrl: '/modules/requests/client/views/requests-my.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.REQUESTS_MY'
        }
      })
      .state('requests.res', {
        url: '/res',
        templateUrl: '/modules/requests/client/views/requests-res.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.REQUESTS_RES'
        }
      })
      .state('requests.add', {
        url: '/add',
        templateUrl: '/modules/requests/client/views/requests-add.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.REQUESTS_ADD'
        }
      });
  }
}());
