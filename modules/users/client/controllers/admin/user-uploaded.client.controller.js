(function () {
  'use strict';

  angular
    .module('users')
    .controller('UserUploadedController', UserUploadedController);

  UserUploadedController.$inject = ['$scope', '$state', '$translate', 'userResolve', '$timeout', 'Authentication', 'Notification', 'TorrentsService',
    'MeanTorrentConfig', '$window', '$filter', 'DownloadService', 'DebugConsoleService', 'TorrentGetInfoServices', 'ResourcesTagsServices'];

  function UserUploadedController($scope, $state, $translate, user, $timeout, Authentication, Notification, TorrentsService, MeanTorrentConfig,
                                  $window, $filter, DownloadService, mtDebug, TorrentGetInfoServices, ResourcesTagsServices) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = user;
    vm.RTS = ResourcesTagsServices;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

    vm.searchTags = [];
    vm.releaseYear = undefined;
    vm.filterType = undefined;
    vm.filterHnR = false;
    vm.filterTop = false;
    vm.filterUnique = false;
    vm.filterSale = false;
    vm.torrentRLevel = 'level0';
    vm.torrentType = 'aggregate';

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.torrentsPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.tooltipMsg = 'VIP.VIP_TORRENTS_IS_LOADING';
      vm.getUserUploadedTorrent(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (vm.pagedItems.length === 0) {
          vm.tooltipMsg = 'VIP.VIP_TORRENTS_IS_EMPTY';
        } else {
          vm.tooltipMsg = undefined;
        }
        if (callback) callback();
      });
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
     * getUserUploadedTorrent
     * @param p
     * @param callback
     */
    vm.getUserUploadedTorrent = function (p, callback) {
      TorrentsService.get({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage,
        userid: $state.params.userId,
        torrent_type: (vm.filterType && vm.filterType !== 'aggregate') ? vm.filterType : (vm.torrentType === 'aggregate' ? 'all' : vm.torrentType),
        torrent_status: 'all',
        torrent_vip: vm.filterVIP ? vm.filterVIP : undefined,
        torrent_rlevel: vm.torrentRLevel,
        torrent_release: vm.releaseYear,
        torrent_tags: vm.searchTags,
        torrent_hnr: vm.filterHnR,
        torrent_sale: vm.filterSale,
        isTop: vm.filterTop,
        isUnique: vm.filterUnique
      }, function (data) {
        mtDebug.info(data);
        callback(data);
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('UPLOADED_LIST_ERROR')
        });
      });
    };
  }
}());
