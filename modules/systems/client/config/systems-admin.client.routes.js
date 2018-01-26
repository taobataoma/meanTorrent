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
      .state('admin.systems.templates', {
        url: '/templates',
        templateUrl: '/modules/systems/client/views/templates.client.view.html'
      })
      .state('admin.systems.strings', {
        url: '/strings',
        templateUrl: '/modules/systems/client/views/strings.client.view.html'
      })
      .state('admin.systems.commands', {
        url: '/commands',
        templateUrl: '/modules/systems/client/views/commands.client.view.html'
      });
  }
}());

