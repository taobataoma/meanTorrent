(function () {
  'use strict';

  angular
    .module('favorites.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('favorites', {
        abstract: true,
        url: '/favorites',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('favorites.list', {
        url: '',
        templateUrl: '/modules/favorites/client/views/list.client.view.html',
        data: {
          pageTitle: 'MENU_MY_FAVORITE'
        }
      });
  }
}());
