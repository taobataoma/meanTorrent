(function () {
  'use strict';

  // Setting up route
  angular
    .module('forums.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.forums', {
        abstract: true,
        url: '/forums',
        template: '<ui-view/>'
      })
      .state('admin.forums.configure', {
        url: '/configure',
        templateUrl: '/modules/forums/client/views/admin/configure.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.ADMIN_FORUMS_CONFIGURE'
        }
      })
      .state('admin.forums.management', {
        url: '/management',
        templateUrl: '/modules/forums/client/views/admin/management.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.ADMIN_FORUMS_MANAGEMENT'
        }
      });
  }
}());
