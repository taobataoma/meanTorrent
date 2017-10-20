(function () {
  'use strict';

  angular
    .module('about')
    .controller('AboutController', AboutController);

  AboutController.$inject = ['$scope', 'getStorageLangService', 'MeanTorrentConfig', 'AdminService', 'MakerGroupService', 'DebugConsoleService'];

  function AboutController($scope, getStorageLangService, MeanTorrentConfig, AdminService, MakerGroupService, mtDebug) {
    var vm = this;
    vm.lang = getStorageLangService.getLang();
    vm.blackListConfig = MeanTorrentConfig.meanTorrentConfig.clientBlackList;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;

    vm.init = function () {

    };

    /**
     * getOperList
     */
    vm.getOperList = function () {
      AdminService.get({
        isOper: true,
        isAdmin: true
      }, function (data) {
        vm.operList = data.rows;
      });
    };

    /**
     * getMakerList
     */
    vm.getMakerList = function () {
      MakerGroupService.query(function (data) {
        vm.makerList = data;
        mtDebug.info(data);
      });
    };

    /**
     * spinCog
     */
    vm.spinCog = function (evt, id) {
      var e = $('#cog_' + id);
      e.addClass('fa-spin');
    };

    /**
     * stopCog
     */
    vm.stopCog = function (evt, id) {
      var e = $('#cog_' + id);
      e.removeClass('fa-spin');
    };
  }
}());
