(function () {
  'use strict';

  angular
    .module('forums.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('forums', {
        url: '/forums',
        templateUrl: '',
        controller: '',
        controllerAs: '',
        data: {
          //roles: ['user', 'admin'],
          pageTitle: 'Forums'
        }
      });
  }
}());
