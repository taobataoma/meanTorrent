(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'NotifycationService', 'MeanTorrentConfig',
    'AdminService', 'ScoreLevelService', 'DebugConsoleService', 'TorrentGetInfoServices', 'SideOverlay', 'MakerGroupService', '$filter', '$translate',
    'marked', 'ModalConfirmService', 'MedalsService', 'MedalsInfoServices', 'localStorageService'];

  function UserController($scope, $state, $window, Authentication, user, Notification, NotifycationService, MeanTorrentConfig,
                          AdminService, ScoreLevelService, mtDebug, TorrentGetInfoServices, SideOverlay, MakerGroupService, $filter, $translate,
                          marked, ModalConfirmService, MedalsService, MedalsInfoServices, localStorageService) {
    var vm = this;
    vm.TGI = TorrentGetInfoServices;
    vm.authentication = Authentication;
    vm.user = user;
    vm.selectedRole = vm.user.roles[0];
    vm.selectedStatus = vm.user.status;
    vm.userRolesConfig = MeanTorrentConfig.meanTorrentConfig.userRoles;
    vm.userStatusConfig = MeanTorrentConfig.meanTorrentConfig.userStatus;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.remove = remove;
    vm.update = update;
    vm.messageTo = messageTo;
    vm.isContextUserSelf = isContextUserSelf;
    vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;
    vm.inviteConfig = MeanTorrentConfig.meanTorrentConfig.invite;
    vm.medalsConfig = MeanTorrentConfig.meanTorrentConfig.medals;
    vm.homeConfig = MeanTorrentConfig.meanTorrentConfig.home;

    vm.searchTags = [];
    vm.maker = {};

    angular.element(document).ready(function () {
    });

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

    vm.presentInvitationsPopover = {
      title: 'PRESENT_INVITATIONS_TITLE',
      templateUrl: 'present-invitations.html',
      label_numbers: 'PRESENT_INVITATIONS_NUMBERS',
      label_days: 'PRESENT_INVITATIONS_DAYS',
      isOpen: false,
      numbers: 1,
      days: 1
    };

    mtDebug.info(vm.user);

    /**
     * initTopBackground
     */
    vm.initTopBackground = function () {
      var url = localStorageService.get('body_background_image') || vm.homeConfig.bodyBackgroundImage;
      $('.backdrop').css('backgroundImage', 'url("' + url + '")');
    };

    /**
     * $watch 'vm.user'
     */
    $scope.$watch('vm.user', function (newValue, oldValue) {
      if (vm.user) {
        vm.getUserHistory();
      }
    });

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
      var to = vm.user._id + '|' + vm.user.displayName;
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

      vm.user.lastName = '';
      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        NotifycationService.showSuccessNotify('EDIT_USER_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'EDIT_USER_FAILED');
      });
    }

    /**
     * isContextUserSelf
     * @returns {boolean}
     */
    function isContextUserSelf() {
      if (!vm.user || !vm.authentication.user) {
        return false;
      } else {
        return vm.user.username === vm.authentication.user.username;
      }
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
     * resetVIPData
     */
    vm.resetVIPData = function () {
      var user = vm.user;
      AdminService.resetVIPData({
        userId: user._id
      })
        .then(onSuccess)
        .catch(onError);

      function onSuccess(response) {
        vm.user = response;
        mtDebug.info(response);

        NotifycationService.showSuccessNotify('RESET_VIP_DATA_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'RESET_VIP_DATA_FAILED');
      }
    };

    /**
     * alreadyIsFounder
     * @param u
     * @returns {boolean}
     */
    vm.alreadyIsFounder = function (u) {
      var is = false;

      if (u.makers.length > 0) {
        angular.forEach(u.makers, function (m) {
          if (m.user === u._id) {
            is = true;
          }
        });
      }

      return is;
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
     * onDescKeyDown
     * @param e
     */
    vm.onDescKeyDown = function (e) {
      if (e.keyCode === 27) { // ESC
        var hasPopupMenu = false;
        var emojiMenu = $('.textcomplete-dropdown');
        angular.forEach(emojiMenu, function (e) {
          if (e.style.display === 'block') {
            hasPopupMenu = true;
          }
        });
        if (hasPopupMenu) {
          e.stopPropagation();
        }
      }
    };

    /**
     * onPopupMessageOpen
     */
    vm.onPopupMessageOpen = function () {
      $('#maker-name').focus();
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
        vm.user = new AdminService(res);
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
     * onUserStatusChanged
     */
    vm.onUserStatusChanged = function () {
      var user = vm.user;

      if (vm.selectedStatus === 'banned') {
        var modalOptions = {
          closeButtonText: $translate.instant('BANNED.CONFIRM_CANCEL'),
          actionButtonText: $translate.instant('BANNED.CONFIRM_OK'),
          headerText: $translate.instant('BANNED.CONFIRM_HEADER_TEXT'),
          bodyText: $translate.instant('BANNED.CONFIRM_BODY_TEXT', {uname: user.displayName}),

          selectOptions: {
            enable: true,
            title: 'BANNED.REASON_TITLE',
            options: [
              'BANNED.REASON_ILLEGAL_SIGN_IN',
              'BANNED.REASON_ACCOUNT_TRADE',
              'BANNED.REASON_EXAMINATION_NOT_FINISHED',
              'BANNED.REASON_VIOLATED_RULES'
            ]
          }
        };
        ModalConfirmService.showModal({}, modalOptions)
          .then(function (result) {
            var reason = result.reason;
            if (reason === 'CUSTOM') reason = result.custom;

            AdminService.setUserStatus({
              userId: user._id,
              userStatus: vm.selectedStatus,
              banReason: reason
            })
              .then(onSuccess)
              .catch(onError);
          });
      } else {
        AdminService.setUserStatus({
          userId: user._id,
          userStatus: vm.selectedStatus,
          banReason: ''
        })
          .then(onSuccess)
          .catch(onError);
      }

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

    /**
     * presentInvitations
     */
    vm.presentInvitations = function () {
      if (isNaN(vm.presentInvitationsPopover.numbers)) {
        return false;
      } else if (vm.presentInvitationsPopover.numbers < 0) {
        return false;
      } else {
        var user = vm.user;
        AdminService.presentUserInvitations({
          userId: user._id,
          numbers: vm.presentInvitationsPopover.numbers,
          days: vm.presentInvitationsPopover.days
        })
          .then(onSuccess)
          .catch(onError);

        vm.presentInvitationsPopover.isOpen = false;
      }

      function onSuccess(response) {
        vm.user = response;
        NotifycationService.showSuccessNotify('PRESENT_INVITATIONS_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'PRESENT_INVITATIONS_FAILED');
      }
    };

    /**
     * saveRemarks
     */
    vm.saveRemarks = function () {
      vm.user.$update(function (res) {
        vm.user = res;
        NotifycationService.showSuccessNotify('UPDATE_REMARKS_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'UPDATE_REMARKS_FAILED');
      });

    };

    /**
     * getUserHistory
     */
    vm.getUserHistory = function () {
      AdminService.userHistory({
        userId: user._id
      }).then(function (res) {
        vm.historyList = res;
      });
    };

    /**
     * getHistoryContent
     * @param h
     * @returns {string}
     */
    vm.getHistoryContent = function (h) {
      var time = $filter('date')(h.createdAt, 'yyyy-MM-dd HH:mm');
      var con = $translate.instant('HISTORY.' + h.event_str, h.params);

      var res = time + ' - ' + con;
      return marked(res, {sanitize: false});
    };

    /**
     * addMedal
     * @param evt
     */
    vm.addMedal = function (evt) {
      SideOverlay.open(evt, 'medalsPopupSlide');

      vm.medals = MedalsInfoServices.getMedalsAdminHelp();
    };

    /**
     * hasMedal
     * @param md
     * @returns {boolean}
     */
    vm.hasMedal = function (md) {
      var has = false;
      angular.forEach(vm.userMedals, function (m) {
        if (m.medalName === md.name) {
          has = true;
        }
      });
      return has;
    };

    /**
     * hideMedalsPopup
     */
    vm.hideMedalsPopup = function () {
      SideOverlay.close(null, 'medalsPopupSlide');
    };

    /**
     * addMedalToUser
     * @param md
     */
    vm.addMedalToUser = function (md) {
      if (vm.hasMedal(md)) {
        MedalsService.remove({
          userId: vm.user._id,
          medalName: md.name
        }, function (res) {
          vm.removeMedalFromUserLocalMedals(res);
          vm.getUserHistory();
          NotifycationService.showSuccessNotify('MEDALS.REMOVE_SUCCESSFULLY');
        }, function (res) {
          NotifycationService.showErrorNotify(res.data.message, 'MEDALS.REMOVE_FAILED');
        });
      } else {
        MedalsService.update({
          userId: vm.user._id,
          medalName: md.name
        }, function (res) {
          vm.userMedals.push(res);
          vm.userMedals = MedalsInfoServices.mergeMedalsProperty(vm.userMedals);
          vm.getUserHistory();
          NotifycationService.showSuccessNotify('MEDALS.ADD_SUCCESSFULLY');
        }, function (res) {
          NotifycationService.showErrorNotify(res.data.message, 'MEDALS.ADD_FAILED');
        });
      }
    };

    /**
     * removeMedalFromUserLocalMedals
     * @param md
     */
    vm.removeMedalFromUserLocalMedals = function (md) {
      angular.forEach(vm.userMedals, function (m) {
        if (m.medalName === md.medalName) {
          vm.userMedals.splice(vm.userMedals.indexOf(m), 1);
        }
      });
    };

    /**
     * getUserMedals
     */
    vm.getUserMedals = function () {
      MedalsService.query({
        userId: vm.user._id
      }, function (medals) {
        vm.userMedals = MedalsInfoServices.mergeMedalsProperty(medals);
      });
    };

    /**
     * getTooltipHtml
     * @param mt
     * @returns {string|Object}
     */
    vm.getTooltipHtml = function (mt) {
      var h = $translate.instant('MEDALS.DESC.' + mt.prefix.toUpperCase());
      h += '<br><span class="tooltip-award-at">';
      h += $translate.instant('MEDALS.AWARD_AT');
      h += ': ';
      h += $filter('date')(mt.createdAt, 'yyyy-MM-dd HH:mm:ss');
      h += '</span';

      return h;
    };
  }
}());
