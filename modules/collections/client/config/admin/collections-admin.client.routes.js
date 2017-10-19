(function () {
  'use strict';

  angular
    .module('collections.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.collections', {
        url: '/collections',
        templateUrl: '/modules/collections/client/views/admin/collections-admin.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.COLLECTIONS'
        }
      });
  }
}());
