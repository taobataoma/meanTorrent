(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('torrents.services')
    .provider('MeanTorrentConfig', MeanTorrentConfig);

  //MeanTorrentConfig.$inject = ['$window'];

  function MeanTorrentConfig() {

    this.meanTorrentConfig = function () {
      var meanTorrentConfig = window.meanTorrentConfig;
      return meanTorrentConfig;
    };

    this.$get = [function () {
      var meanTorrentConfig = {
        meanTorrentConfig: window.meanTorrentConfig
      };
      return meanTorrentConfig;
    }];
  }
}());
