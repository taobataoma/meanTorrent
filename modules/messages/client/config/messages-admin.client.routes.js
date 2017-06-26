(function () {
  'use strict';

  // Setting up route
  angular
    .module('messages.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.messages', {
        url: '/messages',
        templateUrl: '/modules/messages/client/views/admin/send.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.ADMIN_MESSAGES'
        }
      });
  }
}());
