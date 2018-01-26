(function () {
  'use strict';

  // Setting up route
  angular
    .module('systems.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.systems', {
        url: '/systems',
        abstract: true,
        templateUrl: '/modules/systems/client/views/panel.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.ADMIN_SYSTEMS',
          roles: ['admin']
        }
      })
      .state('admin.systems.config', {
        url: '/config',
        templateUrl: '/modules/systems/client/views/config.client.view.html'
      })
      .state('admin.systems.template', {
        url: '/template',
        templateUrl: '/modules/systems/client/views/template.client.view.html'
      });
  }
}());

