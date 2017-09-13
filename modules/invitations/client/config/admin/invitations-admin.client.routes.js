(function () {
  'use strict';

  // Setting up route
  angular
    .module('invitations.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.invitations', {
        abstract: true,
        url: '/invitations',
        template: '<ui-view/>'
      })
      .state('admin.invitations.official', {
        url: '/official',
        templateUrl: '/modules/invitations/client/views/admin/official.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.ADMIN_OFFICIAL_INVITATION'
        }
      });
  }
}());

