(function () {
  'use strict';

  angular
    .module('users')
    .controller('WarningController', WarningController);

  WarningController.$inject = ['$rootScope', '$state', '$translate', '$timeout', 'Authentication', 'Notification', 'PeersService', 'CompleteService',
    'MeanTorrentConfig', '$window', '$filter', 'DownloadService', 'NotifycationService', 'ModalConfirmService', 'getStorageLangService', 'DebugConsoleService'];

  function WarningController($rootScope, $state, $translate, $timeout, Authentication, Notification, PeersService, CompleteService, MeanTorrentConfig,
                             $window, $filter, DownloadService, NotifycationService, ModalConfirmService, getStorageLangService, mtDebug) {
    var vm = this;
    vm.user = Authentication.user;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.torrentSalesType = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.lang = getStorageLangService.getLang();
    vm.voteTitleConfig = MeanTorrentConfig.meanTorrentConfig.voteTitle;

    vm.searchTags = [];

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * getWarningTorrent
     */
    vm.getWarningTorrent = function () {
      PeersService.getMyWarningList(function (items) {
        vm.warningList = items;
        mtDebug.info(items);
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
        bodyText: $translate.instant('REMOVE_WARNING_CONFIRM_BODY_TEXT', {score: vm.hnrConfig.scoreToRemoveWarning})
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
            vm.warningList.splice(vm.warningList.indexOf(comp), 1);
            $rootScope.$broadcast('user-hnr-warnings-changed');
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
