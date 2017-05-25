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
        templateUrl: '/modules/messages/client/views/messages.client.view.html'
      })
      .state('messages.inbox', {
        url: '/inbox',
        templateUrl: '/modules/messages/client/views/inbox.client.view.html'
      })
      .state('status', {
        abstract: true,
        url: '/status',
        templateUrl: '/modules/users/client/views/status/status.client.view.html'
      })
      .state('status.account', {
        url: '/account',
        templateUrl: '/modules/users/client/views/status/account.client.view.html'
      });
  }
}());
