(function () {
  'use strict';

  angular
    .module('users')
    .controller('UserLeechingController', UserLeechingController);

  UserLeechingController.$inject = ['$scope', '$state', '$translate', 'userResolve', '$timeout', 'Authentication', 'Notification', 'PeersService',
    'MeanTorrentConfig', '$window', '$filter', 'DownloadService', 'DebugConsoleService', 'TorrentGetInfoServices', 'ResourcesTagsServices'];

  function UserLeechingController($scope, $state, $translate, user, $timeout, Authentication, Notification, PeersService, MeanTorrentConfig,
                                  $window, $filter, DownloadService, mtDebug, TorrentGetInfoServices, ResourcesTagsServices) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = user;
    vm.RTS = ResourcesTagsServices;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

    vm.searchTags = [];

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
      vm.filteredItems = $filter('filter')(vm.userLeechingList, {
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
     * getUserLeechingTorrent
     */
    vm.getUserLeechingTorrent = function () {
      PeersService.getUserLeechingList({
        userId: $state.params.userId
      }, function (items) {
        for (var i = items.length - 1; i >= 0; i--) {
          if (!items[i].torrent) {
            items.splice(i, 1);
          }
        }
        vm.userLeechingList = items;
        vm.buildPager();
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('DOWNLOADING_LIST_ERROR')
        });
      });
    };
  }
}());
