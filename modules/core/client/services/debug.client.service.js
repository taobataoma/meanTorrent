(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('core')
    .factory('DebugConsoleService', DebugConsoleService);

  DebugConsoleService.$inject = ['MeanTorrentConfig', 'Authentication'];

  function DebugConsoleService(MeanTorrentConfig, Authentication) {
    var appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    var announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;

    var service = {
      info: debugInfo
    };

    return service;

    function debugInfo(obj) {
      if (appConfig.showClientDebugLog && announceConfig.debugClientSideUser.ids.includes(Authentication.user._id)) {
        console.log(obj);
      }
    }
  }
}());
