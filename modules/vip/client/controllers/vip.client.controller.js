(function () {
  'use strict';

  angular
    .module('vip')
    .controller('VipController', VipController);

  VipController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'getStorageLangService', 'MeanTorrentConfig', 'TorrentsService',
    'DebugConsoleService', '$timeout', 'uibButtonConfig', 'TorrentGetInfoServices', 'DownloadService', 'ResourcesTagsServices', '$window'];

  function VipController($scope, $state, $translate, Authentication, getStorageLangService, MeanTorrentConfig, TorrentsService,
                         mtDebug, $timeout, uibButtonConfig, TorrentGetInfoServices, DownloadService, ResourcesTagsServices, $window) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = Authentication.user;
    vm.RTS = ResourcesTagsServices;
    vm.lang = getStorageLangService.getLang();
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.torrentType = MeanTorrentConfig.meanTorrentConfig.torrentType;
    vm.vipTorrentType = 'movie';

    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.searchTags = [];

    uibButtonConfig.activeClass = 'btn-success';

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.torrentsPerPage;
      vm.currentPage = 1;

      vm.tooltipMsg = 'VIP.VIP_TORRENTS_IS_LOADING';
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.getVIPTorrents(vm.currentPage, function (items) {
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
     * orderByVote
     */
    vm.orderByVote = function () {
      vm.sortSLF = undefined;

      if (vm.sortVote === undefined) {
        vm.sortVote = '-';
        vm.sort = {'resource_detail_info.vote_average': -1};
      } else if (vm.sortVote === '-') {
        vm.sortVote = undefined;
        vm.sort = undefined;
      }

      vm.buildPager();
    };

    /**
     * orderBySLF
     */
    vm.orderBySLF = function () {
      vm.sortVote = undefined;

      if (vm.sortSLF === undefined) {
        vm.sortSLF = '-S';
        vm.sort = {torrent_seeds: -1};
      } else if (vm.sortSLF === '-S') {
        vm.sortSLF = '-L';
        vm.sort = {torrent_leechers: -1};
      } else if (vm.sortSLF === '-L') {
        vm.sortSLF = '-F';
        vm.sort = {torrent_finished: -1};
      } else if (vm.sortSLF === '-F') {
        vm.sortSLF = undefined;
        vm.sort = undefined;
      }

      vm.buildPager();
    };

    /**
     *
     * @returns {string|Object}
     */
    vm.getOrderTableHead = function () {
      var res = $translate.instant('TABLE_FIELDS.SEEDS_LEECHERS_FINISHED');
      switch (vm.sortSLF) {
        case '-S':
          res = $translate.instant('TABLE_FIELDS.SORT_S');
          res += '<i class="fa fa-caret-down text-info"></i>';
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_L');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_F');
          break;
        case '+S':
          res = $translate.instant('TABLE_FIELDS.SORT_S');
          res += '<i class="fa fa-caret-up text-info"></i>';
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_L');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_F');
          break;
        case '-L':
          res = $translate.instant('TABLE_FIELDS.SORT_S');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_L');
          res += '<i class="fa fa-caret-down text-info"></i>';
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_F');
          break;
        case '+L':
          res = $translate.instant('TABLE_FIELDS.SORT_S');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_L');
          res += '<i class="fa fa-caret-up text-info"></i>';
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_F');
          break;
        case '-F':
          res = $translate.instant('TABLE_FIELDS.SORT_S');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_L');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_F');
          res += '<i class="fa fa-caret-down text-info"></i>';
          break;
        case '+F':
          res = $translate.instant('TABLE_FIELDS.SORT_S');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_L');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_F');
          res += '<i class="fa fa-caret-up text-info"></i>';
          break;
      }
      return res;
    };

    /**
     * getVIPTorrents
     * @param p
     * @param callback
     */
    vm.getVIPTorrents = function (p, callback) {
      console.log({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage,
        sort: vm.sort,
        torrent_type: vm.vipTorrentType,
        torrent_status: 'reviewed',
        torrent_vip: true,
        keys: vm.search
      });
      TorrentsService.get({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage,
        sort: vm.sort,
        torrent_type: vm.vipTorrentType,
        torrent_status: 'reviewed',
        torrent_vip: true,
        keys: vm.search
      }, function (data) {
        mtDebug.info(data);
        callback(data);
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('VIP.TORRENTS_LIST_ERROR')
        });
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
     * openTorrentInfo
     * @param id
     */
    vm.openTorrentInfo = function (id) {
      var url = $state.href('torrents.view', {torrentId: id});
      $window.open(url, '_blank');
    };
  }
}());
