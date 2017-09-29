(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'NotifycationService', 'MeanTorrentConfig',
    'AdminService', 'ScoreLevelService', 'PeersService', 'DownloadService', '$translate', 'TorrentsService', 'ModalConfirmService', 'CompleteService',
    'DebugConsoleService'];

  function UserController($scope, $state, $window, Authentication, user, Notification, NotifycationService, MeanTorrentConfig, AdminService,
                          ScoreLevelService, PeersService, DownloadService, $translate, TorrentsService, ModalConfirmService, CompleteService,
                          mtDebug) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = user;
    vm.selectedRole = vm.user.roles[0];
    vm.userRolesConfig = MeanTorrentConfig.meanTorrentConfig.userRoles;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.remove = remove;
    vm.update = update;
    vm.messageTo = messageTo;
    vm.isContextUserSelf = isContextUserSelf;
    vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);
    vm.voteTitleConfig = MeanTorrentConfig.meanTorrentConfig.voteTitle;

    vm.searchTags = [];

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
     * onUserRoleChanged
     * admin set user`s role
     */
    vm.onUserRoleChanged = function () {
      var user = vm.user;
      AdminService.setUserRole({
        userId: user._id,
        userRole: [vm.selectedRole]
      })
        .then(onSetRoleSuccess)
        .catch(onSetRoleError);

      function onSetRoleSuccess(response) {
        vm.user = response;

        NotifycationService.showSuccessNotify('SET_ROLE_SUCCESSFULLY');
      }

      function onSetRoleError(response) {
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
        .then(onSetRoleSuccess)
        .catch(onSetRoleError);

      function onSetRoleSuccess(response) {
        vm.user = response;

        NotifycationService.showSuccessNotify('SET_STATUS_SUCCESSFULLY');
      }

      function onSetRoleError(response) {
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
          .then(onSetScoreSuccess)
          .catch(onSetScoreError);

        vm.setUserScorePopover.isOpen = false;
      }

      function onSetScoreSuccess(response) {
        vm.user = response;
        mtDebug.info(vm.scoreLevelData);
        vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);
        mtDebug.info(vm.scoreLevelData);

        NotifycationService.showSuccessNotify('SET_SCORE_SUCCESSFULLY');
      }

      function onSetScoreError(response) {
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
          .then(onSetUploadedSuccess)
          .catch(onSetUploadedError);

        vm.setUserUploadedPopover.isOpen = false;
      }

      function onSetUploadedSuccess(response) {
        vm.user = response;

        NotifycationService.showSuccessNotify('SET_UPLOADED_SUCCESSFULLY');
      }

      function onSetUploadedError(response) {
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
          .then(onSetDownloadedSuccess)
          .catch(onSetDownloadedError);

        vm.setUserDownloadedPopover.isOpen = false;
      }

      function onSetDownloadedSuccess(response) {
        vm.user = response;

        NotifycationService.showSuccessNotify('SET_DOWNLOADED_SUCCESSFULLY');
      }

      function onSetDownloadedError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'SET_DOWNLOADED_FAILED');
      }
    };

    /**
     * getUserSeedingTorrent
     */
    vm.getUserSeedingTorrent = function () {
      PeersService.getUserSeedingList({
        userId: vm.user._id
      }, function (items) {
        mtDebug.info(items);
        vm.UserSeedingList = items;
        for (var i = items.length - 1; i >= 0; i--) {
          if (!items[i].torrent) {
            items.splice(i, 1);
          }
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('SEEDING_LIST_ERROR')
        });
      });
    };

    /**
     * getUserLeechingTorrent
     */
    vm.getUserLeechingTorrent = function () {
      PeersService.getUserLeechingList({
        userId: vm.user._id
      }, function (items) {
        vm.leechingList = items;
        for (var i = items.length - 1; i >= 0; i--) {
          if (!items[i].torrent) {
            items.splice(i, 1);
          }
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('DOWNLOADING_LIST_ERROR')
        });
      });
    };

    /**
     * getUserWarningTorrent
     */
    vm.getUserWarningTorrent = function () {
      PeersService.getUserWarningList({
        userId: vm.user._id
      }, function (items) {
        vm.UserWarningList = items;
        for (var i = items.length - 1; i >= 0; i--) {
          if (!items[i].torrent) {
            items.splice(i, 1);
          }
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('WARNING_LIST_ERROR')
        });
      });
    };

    /**
     * getUserUploadedTorrent
     */
    vm.getUserUploadedTorrent = function () {
      TorrentsService.get({
        userid: vm.user._id,
        torrent_type: 'all',
        torrent_status: 'all',
        torrent_vip: false
      }, function (items) {
        vm.UserUploadedList = items.rows;
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('UPLOADED_LIST_ERROR')
        });
      });

    };

    /**
     * getTagTitle
     * @param tag: tag name
     * @returns {*}
     */
    vm.getTagTitle = function (tag, item) {
      var tmp = tag;
      var find = false;

      angular.forEach(vm.resourcesTags.radio, function (item) {
        angular.forEach(item.value, function (sitem) {
          if (sitem.name === tag) {
            tmp = item.name;
            find = true;
          }
        });
      });

      if (!find) {
        angular.forEach(vm.resourcesTags.checkbox, function (item) {
          angular.forEach(item.value, function (sitem) {
            if (sitem.name === tag) {
              tmp = item.name;
            }
          });
        });
      }
      return tmp;
    };

    /**
     * downloadTorrent
     * @param id
     */
    vm.downloadTorrent = function (id) {
      var url = '/api/torrents/download/' + id;
      DownloadService.downloadFile(url, null, function (status) {
        if (status === 200) {
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENTS_DOWNLOAD_SUCCESSFULLY')
          });
        }
      }, function (err) {
        Notification.error({
          title: 'ERROR',
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_DOWNLOAD_ERROR')
        });
      });
    };

    /**
     * openTorrentInfo
     * @param id
     */
    vm.openTorrentInfo = function (id) {
      var url = $state.href('torrents.view', {torrentId: id});
      $window.open(url, '_blank');
    };

    /**
     * removeWarning
     * @param comp
     */
    vm.removeWarning = function (comp) {
      var modalOptions = {
        closeButtonText: $translate.instant('REMOVE_WARNING_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('REMOVE_WARNING_CONFIRM_OK'),
        headerText: $translate.instant('REMOVE_WARNING_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('REMOVE_WARNING_CONFIRM_BODY_TEXT_ADMIN')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          if (vm.user.score >= vm.hnrConfig.scoreToRemoveWarning) {
            CompleteService.update({
              completeId: comp._id
            }, function (response) {
              successCallback(response);
            }, function (errorResponse) {
              errorCallback(errorResponse);
            });

          } else {
            NotifycationService.showErrorNotify($translate.instant('REMOVE_WARNING_NO_ENOUGH_SCORE'), 'REMOVE_WARNING_ERROR');
          }

          function successCallback(res) {
            vm.UserWarningList.splice(vm.UserWarningList.indexOf(comp), 1);
            NotifycationService.showSuccessNotify('REMOVE_WARNING_SUCCESSFULLY');
          }

          function errorCallback(res) {
            NotifycationService.showErrorNotify(res.data.message, 'REMOVE_WARNING_ERROR');
          }
        });

    };

    /**
     * getTorrentListImage
     * @param item
     * @returns {string}
     */
    vm.getTorrentListImage = function (item) {
      var result = null;

      switch (item.torrent_type) {
        case 'movie':
        case 'tvserial':
          result = vm.tmdbConfig.posterListBaseUrl + item.resource_detail_info.poster_path;
          break;
        case 'music':
          result = '/modules/torrents/client/uploads/cover/' + item.resource_detail_info.cover;
          break;
      }
      return result;
    };

    /**
     * getTorrentTitle
     * @param item
     * @returns {string}
     */
    vm.getTorrentTitle = function (item) {
      var result = null;

      switch (item.torrent_type) {
        case 'movie':
          result = item.resource_detail_info.original_title;
          break;
        case 'tvserial':
          result = item.resource_detail_info.original_name;
          break;
        case 'music':
          result = item.resource_detail_info.title;
          break;
      }
      return result;
    };

    /**
     * getTorrentOriginalTitle
     * @param item
     * @returns {string}
     */
    vm.getTorrentOriginalTitle = function (item) {
      var result = null;

      switch (item.torrent_type) {
        case 'movie':
          if (item.resource_detail_info.original_title !== item.resource_detail_info.title) {
            result = item.resource_detail_info.title;
          }
          break;
        case 'tvserial':
          if (item.resource_detail_info.original_name !== item.resource_detail_info.name) {
            result = item.resource_detail_info.name;
          }
          break;
      }
      return result;
    };

    /**
     * getVoteTitle
     * @param item
     * @returns {string}
     */
    vm.getVoteTitle = function (item) {
      return item.resource_detail_info.vote_average ? vm.voteTitleConfig.imdb : vm.voteTitleConfig.mt;
    };
  }
}());
