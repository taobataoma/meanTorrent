(function () {
  'use strict';

  angular
    .module('core')
    .controller('ErrorController', ErrorController);

  ErrorController.$inject = ['$stateParams', 'MeanTorrentConfig'];

  function ErrorController($stateParams, MeanTorrentConfig) {
    var vm = this;
    vm.supportConfig = MeanTorrentConfig.meanTorrentConfig.support;
    vm.errorMessage = null;
    vm.errorParams = null;

    // Display custom message if it was set
    if ($stateParams.message) vm.errorMessage = $stateParams.message;
    if ($stateParams.params) vm.errorParams = $stateParams.params;
  }
}());

