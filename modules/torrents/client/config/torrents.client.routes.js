(function () {
  'use strict';

  angular
    .module('torrents.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('torrents', {
        abstract: true,
        url: '/torrents',
        template: '<ui-view/>'
      })
      .state('torrents.uploads', {
        url: '/torrents/uploads',
        templateUrl: '/modules/torrents/client/views/uploads-torrents.client.view.html'
      });
  }
}());
