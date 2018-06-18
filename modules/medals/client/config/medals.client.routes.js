(function () {
  'use strict';

  angular
    .module('medals.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('medals', {
        abstract: true,
        url: '/medals',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('medals.list', {
        url: '',
        templateUrl: '/modules/medals/client/views/list.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.MEDALS'
        }
      })
      .state('medals.view', {
        url: '/:medalName',
        templateUrl: '/modules/medals/client/views/view.client.view.html',
        data: {
          medal: null,
          pageTitle: 'PAGETITLE.MEDALS'
        }
      })
      .state('medals.request', {
        url: '/:medalName',
        templateUrl: '/modules/medals/client/views/request.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.MEDALS'
        }
      });
  }
}());
