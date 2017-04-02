(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('torrents.services')
    .factory('TMDBConfig', TMDBConfig);

  TMDBConfig.$inject = ['$window'];

  function TMDBConfig($window) {
    var config = {
      tmdbConfig: $window.tmdbConfig
    };

    return config;
  }
}());
