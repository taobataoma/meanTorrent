(function () {
  'use strict';

  // Setting up route
  angular
    .module('messages.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('messages', {
        abstract: true,
        url: '/messages',
        templateUrl: '/modules/messages/client/views/messages.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('messages.box', {
        url: '/box',
        templateUrl: '/modules/messages/client/views/box.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.MESSAGES_BOX'
        }
      })
      .state('messages.send', {
        url: '/send?to',
        templateUrl: '/modules/messages/client/views/send.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.MESSAGES_SEND'
        }
      });
  }
}());
