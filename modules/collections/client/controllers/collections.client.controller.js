(function () {
  'use strict';

  angular
    .module('collections')
    .controller('CollectionController', CollectionController);

  CollectionController.$inject = ['$scope', '$translate', 'getStorageLangService', 'MeanTorrentConfig'];

  function CollectionController($scope, $translate, getStorageLangService, MeanTorrentConfig) {
    var vm = this;
    vm.lang = getStorageLangService.getLang();
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;

    /**
     * getCollectionsList
     */
    vm.getCollectionsList = function () {

    };
  }
}());
