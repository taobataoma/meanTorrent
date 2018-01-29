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
      .state('admin.systems.assets', {
        url: '/assets',
        templateUrl: '/modules/systems/client/views/assets.client.view.html'
      })
      .state('admin.systems.env', {
        url: '/env',
        templateUrl: '/modules/systems/client/views/env.client.view.html'
      })
      .state('admin.systems.templates', {
        url: '/templates',
        templateUrl: '/modules/systems/client/views/templates.client.view.html'
      })
      .state('admin.systems.trans', {
        url: '/trans',
        templateUrl: '/modules/systems/client/views/trans.client.view.html'
      })
      .state('admin.systems.examination', {
        url: '/examination',
        templateUrl: '/modules/systems/client/views/examination.client.view.html'
      })
      .state('admin.systems.commands', {
        url: '/commands',
        templateUrl: '/modules/systems/client/views/commands.client.view.html'
      })
      .state('admin.systems.backup', {
        url: '/backup',
        templateUrl: '/modules/backup/client/views/backup.client.view.html'
      });

  }
}());

