(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('torrents.services')
    .factory('AnnounceConfig', AnnounceConfig);

  AnnounceConfig.$inject = ['$window'];

  function AnnounceConfig($window) {
    var config = {
      announce: $window.announce
    };

    return config;
  }
}());
