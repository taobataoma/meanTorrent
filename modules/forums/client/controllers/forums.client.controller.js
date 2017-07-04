(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsController', ForumsController);

  ForumsController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsAdminService', 'SideOverlay', '$filter', 'NotifycationService'];

  function ForumsController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsAdminService, SideOverlay, $filter, NotifycationService) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;

    vm.forum = {};

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
    vm.openSideOverlay = function (evt, f) {
      if (f) {
        vm.forum = f;
      } else {
        vm.forum = {
          name: '',
          desc: '',
          category: 'discuss',
          order: 0,
          readOnly: false
        };
      }
      vm.categoryChanged();
      SideOverlay.open(evt, 'popupSlide');
    };

    /**
     *
     */
    vm.categoryChanged = function () {
      vm.selectedForums = $filter('filter')(vm.forums, {
        category: vm.forum.category
      });

      vm.forum.order = vm.selectedForums.length;
    };

    /**
     * createNewForum
     */
    vm.createNewForum = function () {
      var f = new ForumsAdminService(vm.forum);
      f.$save(function (res) {
        NotifycationService.showSuccessNotify('FORUMS.ADD_SUCCESSFULLY');
        vm.forum = {};
        SideOverlay.close(null, 'popupSlide');
        $state.reload();
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.ADD_FAILED');
      });
    };
  }
}());
