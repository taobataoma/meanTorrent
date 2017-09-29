(function () {
  'use strict';

  angular
    .module('users')
    .controller('UploadedController', UploadedController);

  UploadedController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'Notification', 'TorrentsService',
    'MeanTorrentConfig', '$window', '$filter', 'DownloadService', 'DebugConsoleService'];

  function UploadedController($scope, $state, $translate, $timeout, Authentication, Notification, TorrentsService, MeanTorrentConfig,
                            $window, $filter, DownloadService, mtDebug) {
    var vm = this;
    vm.user = Authentication.user;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.torrentSalesType = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
    vm.voteTitleConfig = MeanTorrentConfig.meanTorrentConfig.voteTitle;

    vm.searchTags = [];

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.filteredItems = $filter('filter')(vm.uploadedList, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);

      if (callback) callback();
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_torrent_list');

      $('.tb-v-middle').fadeTo(100, 0.01, function () {
        vm.figureOutItemsToDisplay(function () {
          $timeout(function () {
            $('.tb-v-middle').fadeTo(400, 1, function () {
              //window.scrollTo(0, element[0].offsetTop - 60);
              $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
            });
          }, 100);
        });
      });
    };

    /**
     * getUploadedTorrent
     */
    vm.getUploadedTorrent = function () {
      TorrentsService.get({
        userid: vm.user._id,
        torrent_type: 'all',
        torrent_status: 'all',
        torrent_vip: false
      }, function (items) {
        vm.uploadedList = items.rows;
        mtDebug.info(items);
        vm.buildPager();
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
