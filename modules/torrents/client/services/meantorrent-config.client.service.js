(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('torrents.services')
    .factory('MeanTorrentConfig', MeanTorrentConfig);

  MeanTorrentConfig.$inject = ['$window'];

  function MeanTorrentConfig($window) {
    var config = {
      meanTorrentConfig: $window.meanTorrentConfig
    };

    return config;
  }
}());
