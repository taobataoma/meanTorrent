(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsController', ForumsController);

  ForumsController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsAdminService', 'SideOverlay', '$filter', 'NotifycationService',
    'marked'];

  function ForumsController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsAdminService, SideOverlay, $filter, NotifycationService,
                            marked) {
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
     * popupCreateForum
     * @param evt
     */
    vm.popupCreateForum = function (evt) {
      vm.forum = {
        name: '',
        desc: '',
        category: 'discuss',
        order: 0,
        readOnly: false
      };

      vm.actionTitle = 'FORUMS.BTN_ADD_FORUM';
      vm.isEdit = false;
      vm.categoryChanged();
      SideOverlay.open(evt, 'popupSlide');
    };
    /**
     * popupEditForum
     * @param evt
     */
    vm.popupEditForum = function (evt, f) {
      if (f) {
        vm.forum = f;
        vm.actionTitle = 'FORUMS.BTN_EDIT_FORUM';
        vm.isEdit = true;
        SideOverlay.open(evt, 'popupSlide');
      }
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
        vm.forum = undefined;
        SideOverlay.close(null, 'popupSlide');
        vm.init();
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.ADD_FAILED');
      });
    };

    /**
     * editForum
     */
    vm.editForum = function () {
      vm.forum.$update(function (res) {
        NotifycationService.showSuccessNotify('FORUMS.EDIT_SUCCESSFULLY');
        vm.forum = undefined;
        SideOverlay.close(null, 'popupSlide');
        vm.init();
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.EDIT_FAILED');
      });
    };

    /**
     * deleteForum
     */
    vm.deleteForum = function () {
      vm.forum.$remove(function (res) {
        NotifycationService.showSuccessNotify('FORUMS.DELETE_SUCCESSFULLY');
        vm.forum = undefined;
        SideOverlay.close(null, 'popupSlide');
        vm.init();
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.DELETE_FAILED');
      });
    };

    /**
     * getForumDesc
     * @param f
     * @returns {*}
     */
    vm.getForumDesc = function (f) {
      if (f) {
        return marked(f.desc, {sanitize: true});
      }
    };

  }
}());
