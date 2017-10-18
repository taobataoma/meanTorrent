(function () {
  'use strict';

  angular
    .module('about.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.maker', {
        url: '/maker',
        templateUrl: '/modules/about/client/views/admin/maker-admin.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.MAKER'
        }
      });
  }
}());
