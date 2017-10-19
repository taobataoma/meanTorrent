(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'NotifycationService', 'MeanTorrentConfig',
    'AdminService', 'ScoreLevelService', 'DebugConsoleService', 'TorrentGetInfoServices', 'SideOverlay', 'MakerGroupService'];

  function UserController($scope, $state, $window, Authentication, user, Notification, NotifycationService, MeanTorrentConfig,
                          AdminService, ScoreLevelService, mtDebug, TorrentGetInfoServices, SideOverlay, MakerGroupService) {
    var vm = this;
    vm.TGI = TorrentGetInfoServices;
    vm.authentication = Authentication;
    vm.user = user;
    vm.selectedRole = vm.user.roles[0];
    vm.userRolesConfig = MeanTorrentConfig.meanTorrentConfig.userRoles;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.remove = remove;
    vm.update = update;
    vm.messageTo = messageTo;
    vm.isContextUserSelf = isContextUserSelf;
    vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);

    vm.searchTags = [];
    vm.maker = {};

    vm.setUserScorePopover = {
      title: 'SCORE_TITLE',
      templateUrl: 'set-user-score.html',
      isOpen: false
    };

    vm.setUserUploadedPopover = {
      title: 'UPLOADED_TITLE',
      templateUrl: 'set-user-uploaded.html',
      isOpen: false
    };

    vm.setUserDownloadedPopover = {
      title: 'DOWNLOADED_TITLE',
      templateUrl: 'set-user-downloaded.html',
      isOpen: false
    };

    mtDebug.info(vm.user);
    /**
     * remove
     * @param user
     */
    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!'});
          });
        }
      }
    }

    /**
     * messageTo
     */
    function messageTo() {
      var to = vm.user._id + '|' + vm.user.username;
      $state.go('messages.send', {to: to});
    }

    /**
     * update
     * @param isValid
     * @returns {boolean}
     */
    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!'});
      }, function (errorResponse) {
        Notification.error({message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!'});
      });
    }

    /**
     * isContextUserSelf
     * @returns {boolean}
     */
    function isContextUserSelf() {
      return vm.user ? vm.user.username === vm.authentication.user.username : false;
    }

    /**
     * resetDefaultProfileImage
     */
    vm.resetDefaultProfileImage = function () {
      var user = vm.user;
      AdminService.resetUserProfileImage({
        userId: user._id
      })
        .then(onSuccess)
        .catch(onError);

      function onSuccess(response) {
        vm.user = response;

        NotifycationService.showSuccessNotify('SET_IMAGE_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'SET_IMAGE_FAILED');
      }
    };

    /**
     * addVIPMonths
     */
    vm.addVIPMonths = function () {
      var user = vm.user;
      AdminService.addVIPMonths({
        userId: user._id,
        months: 1
      })
        .then(onSuccess)
        .catch(onError);

      function onSuccess(response) {
        vm.user = response;
        mtDebug.info(response);

        NotifycationService.showSuccessNotify('SET_VIP_MONTHS_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'SET_VIP_MONTHS_FAILED');
      }
    };

    /**
     * showMakerGroup
     * @param evt
     */
    vm.showMakerGroup = function (evt) {
      vm.maker = {};
      SideOverlay.open(evt, 'makerSlide');
    };

    /**
     * hideTagsPopup
     */
    vm.hideMakerPopup = function () {
      SideOverlay.close(null, 'makerSlide');
    };

    /**
     * createMakerGroup
     */
    vm.createMakerGroup = function () {
      vm.maker.userId = vm.user._id;
      var maker = new MakerGroupService(vm.maker);

      mtDebug.info(maker);

      maker.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.maker = {};
        vm.user = res;
        NotifycationService.showSuccessNotify('ABOUT.MAKER_CREATE_SUCCESSFULLY');
        SideOverlay.close(null, 'makerSlide');
      }

      function errorCallback(res) {
        vm.maker = {};
        NotifycationService.showErrorNotify(res.data.message, 'ABOUT.MAKER_CREATE_FAILED');
      }

    };

    /**
     * onUserRoleChanged
     * admin set user`s role
     */
    vm.onUserRoleChanged = function () {
      var user = vm.user;
      AdminService.setUserRole({
        userId: user._id,
        userRole: [vm.selectedRole]
      })
        .then(onSuccess)
        .catch(onError);

      function onSuccess(response) {
        vm.user = response;

        NotifycationService.showSuccessNotify('SET_ROLE_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'SET_ROLE_FAILED');
      }
    };

    /**
     * setUserStatus
     */
    vm.setUserStatus = function () {
      var user = vm.user;
      AdminService.setUserStatus({
        userId: user._id,
        userStatus: user.status === 'banned' ? 'normal' : 'banned'
      })
        .then(onSuccess)
        .catch(onError);

      function onSuccess(response) {
        vm.user = response;

        NotifycationService.showSuccessNotify('SET_STATUS_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'SET_STATUS_FAILED');
      }
    };

    /**
     * setUserScore
     */
    vm.setUserScore = function () {
      if (isNaN(vm.setUserScorePopover.number)) {
        return false;
      } else {
        var user = vm.user;
        AdminService.setUserScore({
          userId: user._id,
          userScore: vm.setUserScorePopover.number
        })
          .then(onSuccess)
          .catch(onError);

        vm.setUserScorePopover.isOpen = false;
      }

      function onSuccess(response) {
        vm.user = response;
        mtDebug.info(vm.scoreLevelData);
        vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);
        mtDebug.info(vm.scoreLevelData);

        NotifycationService.showSuccessNotify('SET_SCORE_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'SET_SCORE_FAILED');
      }
    };

    /**
     * setUserUploaded
     */
    vm.setUserUploaded = function () {
      if (isNaN(vm.setUserUploadedPopover.number)) {
        return false;
      } else {
        var user = vm.user;
        AdminService.setUserUploaded({
          userId: user._id,
          userUploaded: vm.setUserUploadedPopover.number * 1024 * 1024 * 1024
        })
          .then(onSuccess)
          .catch(onError);

        vm.setUserUploadedPopover.isOpen = false;
      }

      function onSuccess(response) {
        vm.user = response;

        NotifycationService.showSuccessNotify('SET_UPLOADED_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'SET_UPLOADED_FAILED');
      }
    };

    /**
     * setUserDownloaded
     */
    vm.setUserDownloaded = function () {
      if (isNaN(vm.setUserDownloadedPopover.number)) {
        return false;
      } else {
        var user = vm.user;
        AdminService.setUserDownloaded({
          userId: user._id,
          userDownloaded: vm.setUserDownloadedPopover.number * 1024 * 1024 * 1024
        })
          .then(onSuccess)
          .catch(onError);

        vm.setUserDownloadedPopover.isOpen = false;
      }

      function onSuccess(response) {
        vm.user = response;

        NotifycationService.showSuccessNotify('SET_DOWNLOADED_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'SET_DOWNLOADED_FAILED');
      }
    };
  }
}());
