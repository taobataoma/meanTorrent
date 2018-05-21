(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsController', TorrentsController);

  TorrentsController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'Notification', 'TorrentsService', 'getStorageLangService',
    'MeanTorrentConfig', 'DownloadService', '$window', 'DebugConsoleService', 'TorrentGetInfoServices', 'ResourcesTagsServices', 'moment'];

  function TorrentsController($scope, $state, $translate, $timeout, Authentication, Notification, TorrentsService, getStorageLangService, MeanTorrentConfig,
                              DownloadService, $window, mtDebug, TorrentGetInfoServices, ResourcesTagsServices, moment) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = Authentication.user;
    vm.RTS = ResourcesTagsServices;
    vm.lang = getStorageLangService.getLang();
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.torrentSalesType = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.torrentTypeConfig = MeanTorrentConfig.meanTorrentConfig.torrentType;
    vm.salesGlobalConfig = MeanTorrentConfig.meanTorrentConfig.torrentGlobalSales;
    vm.rssConfig = MeanTorrentConfig.meanTorrentConfig.rss;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;

    vm.searchTags = [];
    vm.searchKey = $state.params.keys || '';
    vm.releaseYear = undefined;
    vm.filterType = undefined;
    vm.filterHnR = false;
    vm.filterTop = false;
    vm.filterUnique = false;
    vm.filterSale = false;
    vm.topItems = 6;
    vm.torrentRLevel = 'level0';

    vm.torrentType = $state.current.data.torrentType || 'aggregate';

    /**
     * scope watch vm.torrentType
     */
    $scope.$watch('vm.torrentType', function (newValue, oldValue) {
      if (vm.torrentType === 'aggregate') {
        vm.filterType = 'aggregate';
      } else {
        vm.filterType = vm.torrentType;
      }
    });

    /**
     * commentBuildPager
     * pagination init
     */
    vm.torrentBuildPager = function () {
      vm.torrentPagedItems = [];
      vm.torrentItemsPerPage = vm.itemsPerPageConfig.torrentsPerPage;
      vm.torrentCurrentPage = 1;
      vm.torrentFigureOutItemsToDisplay();
    };

    /**
     * torrentFigureOutItemsToDisplay
     * @param callback
     */
    vm.torrentFigureOutItemsToDisplay = function (callback) {
      vm.getResourcePageInfo(vm.torrentCurrentPage, function (items) {
        vm.torrentFilterLength = items.total;
        if (vm.moreTopInfo && vm.moreTopInfo.length > 0 && vm.torrentCurrentPage === 1) {
          vm.torrentPagedItems = vm.moreTopInfo.concat(items.rows);
        } else {
          vm.torrentPagedItems = items.rows;
        }

        if (callback) callback();
      });
    };

    /**
     * torrentPageChanged
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
     * getResourceTopInfo
     */
    vm.getResourceTopInfo = function () {
      if (vm.torrentType !== 'aggregate') {
        TorrentsService.get({
          torrent_status: 'reviewed',
          torrent_type: vm.torrentType === 'aggregate' ? 'all' : vm.torrentType,
          torrent_vip: false,
          isTop: true
        }, function (items) {
          mtDebug.info(items);
          vm.listTopInfo = items.rows.slice(0, 6);
          if (items.total > vm.topItems) {
            vm.moreTopInfo = items.rows.slice(vm.topItems, items.total);
          }
          if (vm.moreTopInfo && vm.moreTopInfo.length > 0) {
            vm.torrentPagedItems = vm.moreTopInfo.concat(vm.torrentPagedItems);
          }
        }, function (err) {
          Notification.error({
            message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TOP_LIST_INFO_ERROR')
          });
        });
      }
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
     * orderByVote
     */
    vm.orderByVote = function () {
      vm.sortSLF = undefined;
      vm.sortSize = undefined;
      vm.sortLife = undefined;

      if (vm.sortVote === undefined) {
        vm.sortVote = '-';
        vm.sort = {'resource_detail_info.vote_average': -1};
      } else if (vm.sortVote === '-') {
        vm.sortVote = undefined;
        vm.sort = undefined;
      }

      vm.torrentBuildPager();
    };

    /**
     * orderBySize
     */
    vm.orderBySize = function () {
      vm.sortSLF = undefined;
      vm.sortVote = undefined;
      vm.sortLife = undefined;

      if (vm.sortSize === undefined) {
        vm.sortSize = '-';
        vm.sort = {'torrent_size': -1};
      } else if (vm.sortSize === '-') {
        vm.sortSize = undefined;
        vm.sort = undefined;
      }

      vm.torrentBuildPager();
    };

    /**
     * orderByLife
     */
    vm.orderByLife = function () {
      vm.sortSLF = undefined;
      vm.sortVote = undefined;
      vm.sortSize = undefined;

      if (vm.sortLife === undefined) {
        vm.sortLife = '-';
        vm.sort = {'createdat': 1};
      } else if (vm.sortLife === '-') {
        vm.sortLife = undefined;
        vm.sort = undefined;
      }

      vm.torrentBuildPager();
    };

    /**
     * orderBySLF
     */
    vm.orderBySLF = function () {
      vm.sortVote = undefined;
      vm.sortSize = undefined;
      vm.sortLife = undefined;

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

      vm.torrentBuildPager();
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
     * getResourcePageInfo
     * @param p: page number
     */
    vm.getResourcePageInfo = function (p, callback) {
      //if searchKey or searchTags has value, the skip=0
      var skip = 0;

      TorrentsService.get({
        skip: (p - 1) * vm.torrentItemsPerPage + skip,
        limit: vm.torrentItemsPerPage,
        sort: vm.sort,
        keys: vm.searchKey.trim(),
        torrent_status: 'reviewed',
        torrent_rlevel: vm.torrentRLevel,
        torrent_type: (vm.filterType !== 'aggregate') ? vm.filterType : (vm.torrentType === 'aggregate' ? 'all' : vm.torrentType),
        torrent_vip: false,
        torrent_release: vm.releaseYear,
        torrent_tags: vm.searchTags,
        torrent_hnr: vm.filterHnR,
        torrent_sale: vm.filterSale,
        isTop: vm.filterTop,
        isUnique: vm.filterUnique
      }, function (items) {
        if (items.length === 0) {
          Notification.error({
            message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('LIST_PAGE_INFO_EMPTY')
          });
        } else {
          items.oTotal = items.total;
          items.total = items.total - skip;
          callback(items);
          mtDebug.info(items);
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('LIST_PAGE_INFO_ERROR')
        });
      });

      //make rss url
      vm.rssUrl = vm.appConfig.domain;
      vm.rssUrl += '/api/rss';
      vm.rssUrl += '/' + vm.user.passkey;
      vm.rssUrl += '?language=' + vm.lang;
      vm.rssUrl += '&limit=' + vm.rssConfig.pageItemsNumber;
      vm.rssUrl += vm.searchKey.trim() ? '&keys=' + vm.searchKey.trim() : '';
      vm.rssUrl += '&torrent_type=' + ((vm.filterType !== 'aggregate') ? vm.filterType : (vm.torrentType === 'aggregate' ? 'all' : vm.torrentType));
      vm.rssUrl += vm.releaseYear ? '&torrent_release=' + vm.releaseYear : '';
      vm.rssUrl += vm.searchTags.length ? '&torrent_tags=' + vm.searchTags : '';
      vm.rssUrl += '&torrent_hnr=' + vm.filterHnR;
      vm.rssUrl += '&isTop=' + vm.filterTop;
      vm.rssUrl += '&isUnique=' + vm.filterUnique;
      vm.rssUrl += vm.filterSale ? '&torrent_sale=' + vm.filterSale : '';
    };

    /**
     * clearAllCondition
     */
    vm.clearAllCondition = function () {
      vm.searchKey = '';
      vm.searchTags = [];
      $('.btn-tag').removeClass('btn-success').addClass('btn-default');
      vm.releaseYear = undefined;
      vm.filterHnR = false;
      vm.filterTop = false;
      vm.filterUnique = false;
      vm.filterSale = false;
      vm.torrentRLevel = 'level0';
      vm.filterType = vm.torrentType;

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
     * onTorrentTypeClicked
     * @param t
     */
    vm.onTorrentTypeClicked = function (t) {
      if (vm.filterType === t) {
        vm.filterType = vm.torrentType;
      } else {
        vm.filterType = t;
      }
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
     * onHnRClicked
     */
    vm.onHnRClicked = function () {
      vm.filterHnR = !vm.filterHnR;
      vm.torrentBuildPager();
    };
    vm.onHnRChanged = function () {
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
     * tagsFilter
     * @param item
     * @returns {boolean}
     */
    vm.tagsFilter = function (item) {
      var res = false;

      if (vm.filterType === 'aggregate') {
        angular.forEach(vm.torrentTypeConfig.value, function (t) {
          if (t.enable && item.cats.includes(t.value))
            res = true;
        });
      } else {
        if (item.cats.includes(vm.filterType))
          res = true;
      }

      return res;
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

    /**
     * onTorrentTypeChanged
     */
    vm.onTorrentTypeChanged = function () {
      vm.searchTags = [];
      vm.torrentBuildPager();
    };
  }
}());
