(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsController', ForumsController);

  ForumsController.$inject = ['$scope', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsAdminService'];

  function ForumsController($scope, $translate, Authentication, MeanTorrentConfig, ForumsAdminService) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;

    vm.init = function () {
      ForumsAdminService.query({}, function (items) {
        vm.forums = items;
        console.log(items);
      });
    };
  }
}());
