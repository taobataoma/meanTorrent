(function () {
  'use strict';

  angular
    .module('about')
    .controller('AboutController', AboutController);

  AboutController.$inject = ['$scope', 'MeanTorrentConfig'];

  function AboutController($scope, MeanTorrentConfig) {
    var vm = this;
    vm.blackListConfig = MeanTorrentConfig.meanTorrentConfig.clientBlackList;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;

    vm.init = function () {

    };
  }
}());
