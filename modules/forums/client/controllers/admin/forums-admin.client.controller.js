(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsAdminController', ForumsAdminController);

  ForumsAdminController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsAdminService', 'SideOverlay', '$filter', 'NotifycationService',
    'marked', 'ModalConfirmService'];

  function ForumsAdminController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsAdminService, SideOverlay, $filter, NotifycationService,
                            marked, ModalConfirmService) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;

    vm.addModeratorPopover = {
      title: 'FORUMS.MODERATOR_TITLE',
      templateUrl: 'add-moderator.html',
      items: []
    };

    /**
     * init
     */
    vm.init = function () {
      ForumsAdminService.query({}, function (items) {
        vm.forums = items;
        console.log(items);

        angular.forEach(vm.forums, function (f) {
          vm.addModeratorPopover.items.push(f._id, false);
        });
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
     * @param f: forum
     */
    vm.popupEditForum = function (evt, f) {
      if (f) {
        vm.forum = new ForumsAdminService(f);
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
      var modalOptions = {
        closeButtonText: $translate.instant('FORUMS.DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('FORUMS.DELETE_CONFIRM_OK'),
        headerText: $translate.instant('FORUMS.DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('FORUMS.DELETE_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          vm.forum.$remove(function (res) {
            NotifycationService.showSuccessNotify('FORUMS.DELETE_SUCCESSFULLY');
            vm.forum = undefined;
            SideOverlay.close(null, 'popupSlide');
            vm.init();
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'FORUMS.DELETE_FAILED');
          });
        });
    };

    /**
     * getForumDesc
     * @param f: forum
     * @returns {*}
     */
    vm.getForumDesc = function (f) {
      if (f) {
        return marked(f.desc, {sanitize: true});
      }
    };

    /**
     * addModerator
     */
    vm.addModerator = function () {
      ForumsAdminService.addModerator({
        _id: vm.forum._id,
        _username: vm.addModeratorPopover.username
      }, function (res) {
        NotifycationService.showSuccessNotify('FORUMS.ADD_MODERATOR_SUCCESSFULLY');
        vm.addModeratorPopover.items[vm.forum._id] = false;
        vm.init();
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.ADD_MODERATOR_FAILED');
        vm.addModeratorPopover.items[vm.forum._id] = false;
      });
    };

    /**
     * addModeratorClicked
     * @param f: forum
     */
    vm.addModeratorClicked = function (f) {
      vm.addModeratorPopover.username = undefined;
      vm.addModeratorPopover.items[f._id] = true;

      vm.forum = f;
    };

    /**
     * removeModeratorClicked
     * @param f forum
     * @param m moderator
     */
    vm.removeModeratorClicked = function (f, m) {
      var modalOptions = {
        closeButtonText: $translate.instant('FORUMS.DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('FORUMS.DELETE_CONFIRM_OK'),
        headerText: $translate.instant('FORUMS.DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('FORUMS.REMOVE_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          ForumsAdminService.removeModerator({
            _id: f._id,
            _username: m.username
          }, function (res) {
            NotifycationService.showSuccessNotify('FORUMS.REMOVE_MODERATOR_SUCCESSFULLY');
            vm.init();
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'FORUMS.REMOVE_MODERATOR_FAILED');
          });
        });
    };
  }
}());
