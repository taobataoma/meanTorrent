(function () {
  'use strict';

  angular
    .module('about.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('about', {
        abstract: true,
        url: '/about',
        template: '<ui-view/>'
      })
      .state('about.rules', {
        url: '/rules',
        templateUrl: '/modules/about/client/views/rules.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.RULES'
        }
      })
      .state('about.black', {
        url: '/black',
        templateUrl: '/modules/about/client/views/black.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.BLACK'
        }
      })
      .state('about.maker', {
        url: '/maker',
        templateUrl: '/modules/about/client/views/maker.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.MAKER'
        }
      })
      .state('about.group', {
        url: '/maker/:makerId',
        templateUrl: '/modules/about/client/views/maker-view.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.MAKER'
        }
      })
      .state('about.operlist', {
        url: '/operlist',
        templateUrl: '/modules/about/client/views/operlist.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.OPERLIST'
        }
      });
  }
}());
