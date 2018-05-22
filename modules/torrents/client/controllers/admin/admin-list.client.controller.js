(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsAdminController', TorrentsAdminController);

  TorrentsAdminController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'Notification', 'TorrentsService',
    'MeanTorrentConfig', 'DownloadService', '$window', 'ModalConfirmService', 'NotifycationService', 'DebugConsoleService', 'TorrentGetInfoServices',
    'ResourcesTagsServices', 'localStorageService', 'moment'
  ];

  function TorrentsAdminController($scope, $state, $translate, $timeout, Authentication, Notification, TorrentsService, MeanTorrentConfig,
                                   DownloadService, $window, ModalConfirmService, NotifycationService, mtDebug, TorrentGetInfoServices,
                                   ResourcesTagsServices, localStorageService, moment) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = Authentication.user;
    vm.RTS = ResourcesTagsServices;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.torrentSalesType = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
    vm.torrentRLevels = MeanTorrentConfig.meanTorrentConfig.torrentRecommendLevel;
    vm.torrentTypeConfig = MeanTorrentConfig.meanTorrentConfig.torrentType;
    vm.salesGlobalConfig = MeanTorrentConfig.meanTorrentConfig.torrentGlobalSales;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;

    vm.torrentType = localStorageService.get('admin_last_selected_type') || 'movie';
    vm.filterVIP = isSelectedVipType(vm.torrentType);
    vm.searchTags = [];
    vm.searchKey = '';
    vm.releaseYear = undefined;
    vm.filterHnR = false;
    vm.filterSale = false;
    vm.filterTop = false;
    vm.filterUnique = false;
    vm.filterType = undefined;
    vm.torrentStatus = 'reviewed';
    vm.torrentRLevel = 'level0';

    // vm.torrentType = vm.selectedType === 'newest' ? 'aggregate' : vm.selectedType;

    /**
     * commentBuildPager
     * pagination init
     */
    vm.torrentBuildPager = function () {
      vm.torrentPagedItems = [];
      vm.torrentItemsPerPage = 20;
      vm.torrentCurrentPage = 1;
      vm.torrentFigureOutItemsToDisplay();
    };

    /**
     * onTorrentTypeChanged
     */
    vm.onTorrentTypeChanged = function () {
      vm.searchTags = [];
      vm.filterVIP = isSelectedVipType(vm.torrentType);

      vm.torrentBuildPager();
      localStorageService.set('admin_last_selected_type', vm.torrentType);
    };

    /**
     * isSelectedVipType
     * @param type
     * @returns {boolean}
     */
    function isSelectedVipType(type) {
      var v = false;
      angular.forEach(vm.torrentTypeConfig.value, function (t) {
        if (t.value === type) {
          if (t.role === 'vip') {
            v = true;
          }
        }
      });

      return v;
    }

    /**
     * commentFigureOutItemsToDisplay
     * @param callback
     */
    vm.torrentFigureOutItemsToDisplay = function (callback) {
      vm.getTorrentPageInfo(vm.torrentCurrentPage, function (items) {
        vm.torrentFilterLength = items.total;
        vm.torrentPagedItems = items.rows;

        if (callback) callback();
      });
    };

    /**
     * commentPageChanged
     */
    vm.torrentPageChanged = function () {
      var element = angular.element('#top_of_torrent_list');

      $('.tb-v-middle').fadeTo(100, 0.01, function () {
        vm.torrentFigureOutItemsToDisplay(function () {
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
     * onTorrentStatusClicked
     * @param event
     * @param s: status value
     */
    vm.onTorrentStatusClicked = function (event, s) {
      var e = angular.element(event.currentTarget);

      if (e.hasClass('btn-success')) {
        return;
      } else {
        e.addClass('btn-success').removeClass('btn-default').siblings().removeClass('btn-success').addClass('btn-default');
        vm.torrentStatus = s;
      }
      // vm.torrentStatus = s;
      e.blur();
      vm.torrentBuildPager();
    };

    /**
     * onRecommendLevelClicked
     * @param event
     * @param s: status value
     */
    vm.onRecommendLevelClicked = function (event, l) {
      var e = angular.element(event.currentTarget);

      if (vm.torrentRLevel === l) {
        vm.torrentRLevel = 'level0';
      } else {
        vm.torrentRLevel = l;
      }

      e.blur();
      vm.torrentBuildPager();
    };

    /**
     * onRadioTagClicked
     * @param event
     * @param n: tag name
     */
    vm.onRadioTagClicked = function (event, n) {
      var e = angular.element(event.currentTarget);

      if (e.hasClass('btn-success')) {
        e.removeClass('btn-success').addClass('btn-default');
        vm.searchTags.splice(vm.searchTags.indexOf(n), 1);
      } else {
        e.addClass('btn-success').removeClass('btn-default').siblings().removeClass('btn-success').addClass('btn-default');
        vm.searchTags.push(n);

        angular.forEach(e.siblings(), function (se) {
          if (vm.searchTags.indexOf(se.value) !== -1) {
            vm.searchTags.splice(vm.searchTags.indexOf(se.value), 1);
          }
        });
      }
      e.blur();
      vm.torrentBuildPager();
    };

    /**
     * onCheckboxTagClicked
     * @param event
     * @param n: tag name
     */
    vm.onCheckboxTagClicked = function (event, n) {
      var e = angular.element(event.currentTarget);

      if (e.hasClass('btn-success')) {
        vm.searchTags.push(n);
      } else {
        vm.searchTags.splice(vm.searchTags.indexOf(n), 1);
      }
      vm.torrentBuildPager();
    };

    /**
     * onKeysKeyDown
     * @param evt
     */
    vm.onKeysKeyDown = function (evt) {
      if (evt.keyCode === 13) {
        vm.torrentBuildPager();
      }
    };

    /**
     * getTorrentPageInfo
     * @param p: page number
     */
    vm.getTorrentPageInfo = function (p, callback) {
      TorrentsService.get({
        skip: (p - 1) * vm.torrentItemsPerPage,
        limit: vm.torrentItemsPerPage,
        keys: vm.searchKey.trim(),
        torrent_status: vm.torrentType === 'aggregate' ? 'new' : vm.torrentStatus,
        torrent_rlevel: vm.torrentRLevel,
        torrent_type: vm.torrentType === 'aggregate' ? 'all' : vm.torrentType,
        torrent_release: vm.releaseYear,
        torrent_tags: vm.searchTags,
        torrent_hnr: vm.filterHnR,
        torrent_vip: vm.filterVIP ? vm.filterVIP : undefined,
        torrent_sale: vm.filterSale,
        isTop: vm.filterTop,
        isUnique: vm.filterUnique
      }, function (items) {
        if (items.length === 0) {
          Notification.error({
            message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('MOVIE_PAGE_INFO_EMPTY')
          });
        } else {
          callback(items);
          mtDebug.info(items);
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('MOVIE_PAGE_INFO_ERROR')
        });
      });
    };

    /**
     * clearAllCondition
     */
    vm.clearAllCondition = function () {
      vm.searchKey = '';
      vm.searchTags = [];
      $('.btn-tag-resource .btn-tag').removeClass('btn-success').addClass('btn-default');
      vm.filterVIP = false;
      vm.releaseYear = undefined;
      vm.filterHnR = false;
      vm.filterSale = false;
      vm.filterTop = false;
      vm.filterUnique = false;
      vm.torrentStatus = 'reviewed';
      vm.torrentRLevel = 'level0';


      vm.torrentBuildPager();
    };

    /**
     * onTagClicked
     * @param tag: tag name
     */
    vm.onTagClicked = function (tag) {
      $timeout(function () {
        angular.element('#tag_' + tag).trigger('click');
      }, 10);
    };

    /**
     * onTorrentTypeClicked
     * @param t
     */
    vm.onTorrentTypeClicked = function (t) {
      if (vm.torrentType === t) {
        vm.torrentType = 'aggregate';
        vm.filterVIP = false;
      } else {
        vm.torrentType = t;
      }
      localStorageService.set('admin_last_selected_type', vm.torrentType);
      vm.torrentBuildPager();
    };

    /**
     * onReleaseClicked
     * @param y
     */
    vm.onReleaseClicked = function (y) {
      if (vm.releaseYear === y) {
        vm.releaseYear = undefined;
      } else {
        vm.releaseYear = y;
      }
      vm.torrentBuildPager();
    };

    /**
     * onHnRClicked, onHnRChanged
     */
    vm.onHnRClicked = function () {
      vm.filterHnR = !vm.filterHnR;
      vm.torrentBuildPager();
    };
    vm.onHnRChanged = function () {
      vm.torrentBuildPager();
    };

    /**
     * onSaleChanged
     */
    vm.onSaleClicked = function () {
      vm.filterSale = !vm.filterSale;
      vm.torrentBuildPager();
    };
    vm.onSaleChanged = function () {
      vm.torrentBuildPager();
    };

    /**
     * onVIPClicked, onVIPChanged
     */
    vm.onVIPClicked = function () {
      vm.filterVIP = !vm.filterVIP;
      vm.torrentBuildPager();
    };
    vm.onVIPChanged = function () {
      vm.torrentBuildPager();
    };

    /**
     * onTopClicked, onTopChanged
     */
    vm.onTopClicked = function () {
      vm.filterTop = !vm.filterTop;
      vm.torrentBuildPager();
    };
    vm.onTopChanged = function () {
      vm.torrentBuildPager();
    };

    /**
     * onUniqueClicked, onUniqueChanged
     */
    vm.onUniqueClicked = function () {
      vm.filterUnique = !vm.filterUnique;
      vm.torrentBuildPager();
    };
    vm.onUniqueChanged = function () {
      vm.torrentBuildPager();
    };

    /**
     * onRLevelClicked
     * @param y
     */
    vm.onRLevelClicked = function (l) {
      if (vm.torrentRLevel === l) {
        vm.torrentRLevel = 'level0';
      } else {
        vm.torrentRLevel = l;
      }
      vm.torrentBuildPager();
    };

    /**
     * onMoreTagsClicked
     */
    vm.onMoreTagsClicked = function () {
      var e = $('.more-tags');
      var i = $('#more-tags-icon');

      if (!e.hasClass('panel-collapsed')) {
        e.slideUp();
        e.addClass('panel-collapsed');
        i.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
      } else {
        e.slideDown();
        e.removeClass('panel-collapsed');
        i.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
      }
    };

    /**
     * isGlobalSaleNow
     * @returns {boolean}
     */
    vm.isGlobalSaleNow = function () {
      var start = moment(vm.salesGlobalConfig.global.startAt, vm.salesGlobalConfig.global.timeFormats).valueOf();
      var end = start + vm.salesGlobalConfig.global.expires;
      var now = Date.now();

      if (now > start && now < end && vm.salesGlobalConfig.global.value) {
        return true;
      } else {
        return false;
      }
    };
  }
}());
