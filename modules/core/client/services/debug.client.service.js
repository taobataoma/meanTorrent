(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('core')
    .factory('DebugConsoleService', DebugConsoleService);

  DebugConsoleService.$inject = ['MeanTorrentConfig'];

  function DebugConsoleService(MeanTorrentConfig) {
    var appConfig = MeanTorrentConfig.meanTorrentConfig.app;

    var service = {
      info: debugInfo
    };

    return service;

    function debugInfo(obj) {
      if (appConfig.showDebugLog) {
        console.log(obj);
      }
    }
  }
}());
