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
      .state('torrents.movie', {
        url: '/torrents/movie',
        templateUrl: '/modules/torrents/client/views/movie-list.client.view.html'
      })
      .state('torrents.uploads', {
        url: '/torrents/uploads',
        templateUrl: '/modules/torrents/client/views/uploads-torrents.client.view.html'
      });
  }
}());
