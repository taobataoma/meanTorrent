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
    vm.torrentType = MeanTorrentConfig.meanTorrentConfig.torrentType;
    vm.vipTorrentType = 'movie';

    vm.searchTags = [];

    uibButtonConfig.activeClass = 'btn-success';

    ///**
    // * If user is not signed in then redirect back home
    // */
    //if (!Authentication.user) {
    //  $state.go('authentication.signin');
    //}

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.adminUserListPerPage;
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
     * getVIPTorrents
     * @param p
     * @param callback
     */
    vm.getVIPTorrents = function (p, callback) {
      TorrentsService.get({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage,
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
