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
      .state('admin.systems.templatesFront', {
        url: '/templatesFront',
        templateUrl: '/modules/systems/client/views/templatesFront.client.view.html'
      })
      .state('admin.systems.templatesBack', {
        url: '/templatesBack',
        templateUrl: '/modules/systems/client/views/templatesBack.client.view.html'
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

