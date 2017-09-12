(function () {
  'use strict';

  angular
    .module('users')
    .controller('WarningController', WarningController);

  WarningController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'Notification', 'PeersService',
    'MeanTorrentConfig', '$window', '$filter', 'DownloadService'];

  function WarningController($scope, $state, $translate, $timeout, Authentication, Notification, PeersService, MeanTorrentConfig,
                             $window, $filter, DownloadService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.torrentSalesType = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;

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
        console.log(items);
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
  }
}());
