(function () {
  'use strict';

  angular
    .module('about')
    .controller('AboutController', AboutController);

  AboutController.$inject = ['$scope', 'getStorageLangService', 'MeanTorrentConfig'];

  function AboutController($scope, getStorageLangService, MeanTorrentConfig) {
    var vm = this;
    vm.lang = getStorageLangService.getLang();
    vm.blackListConfig = MeanTorrentConfig.meanTorrentConfig.clientBlackList;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;

    vm.init = function () {

    };
  }
}());
