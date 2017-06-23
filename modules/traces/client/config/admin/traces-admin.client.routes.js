(function () {
  'use strict';

  // Setting up route
  angular
    .module('traces.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.traces', {
        url: '/traces',
        templateUrl: '/modules/traces/client/views/admin/list.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.ADMIN_TRACES_LIST'
        }
      });
  }
}());
