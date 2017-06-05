(function () {
  'use strict';

  angular
    .module('users')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', 'Authentication', 'MeanTorrentConfig'];

  function SettingsController($scope, Authentication, MeanTorrentConfig) {
    var vm = this;

    vm.user = Authentication.user;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
  }
}());
