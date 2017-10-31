(function () {
  'use strict';

  // Setting up route
  angular
    .module('invitations.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.backup', {
        url: '/backup',
        templateUrl: '/modules/backup/client/views/backup.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.ADMIN_BACKUP'
        }
      });
  }
}());

