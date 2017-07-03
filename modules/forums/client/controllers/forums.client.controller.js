(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsController', ForumsController);

  ForumsController.$inject = ['$scope', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsAdminService', 'SideOverlay'];

  function ForumsController($scope, $translate, Authentication, MeanTorrentConfig, ForumsAdminService, SideOverlay) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;

    /**
     * init
     */
    vm.init = function () {
      ForumsAdminService.query({}, function (items) {
        vm.forums = items;
        console.log(items);
      });
    };

    /**
     * openSideOverlay
     * @param evt
     */
    vm.openSideOverlay = function (evt) {
      SideOverlay.open(evt, 'popupSlide');
    };
  }
}());
