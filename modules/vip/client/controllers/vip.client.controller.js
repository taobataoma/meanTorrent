(function () {
  'use strict';

  angular
    .module('vip')
    .controller('VipController', VipController);

  VipController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'getStorageLangService', 'MeanTorrentConfig', 'TorrentsService',
    'DebugConsoleService', '$timeout', 'uibButtonConfig', 'TorrentGetInfoServices', 'DownloadService', 'ResourcesTagsServices', '$window',
    'localStorageService', 'marked', '$templateRequest', '$filter'];

  function VipController($scope, $state, $translate, Authentication, getStorageLangService, MeanTorrentConfig, TorrentsService,
                         mtDebug, $timeout, uibButtonConfig, TorrentGetInfoServices, DownloadService, ResourcesTagsServices, $window,
                         localStorageService, marked, $templateRequest, $filter) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = Authentication.user;
    vm.RTS = ResourcesTagsServices;
    vm.lang = getStorageLangService.getLang();
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.supportConfig = MeanTorrentConfig.meanTorrentConfig.support;
    vm.scoreConfig = MeanTorrentConfig.meanTorrentConfig.score;
    vm.rssConfig = MeanTorrentConfig.meanTorrentConfig.rss;
    vm.ircConfig = MeanTorrentConfig.meanTorrentConfig.ircAnnounce;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.inviteConfig = MeanTorrentConfig.meanTorrentConfig.invite;
    vm.requestsConfig = MeanTorrentConfig.meanTorrentConfig.requests;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.salesTypeConfig = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
    vm.salesGlobalConfig = MeanTorrentConfig.meanTorrentConfig.torrentGlobalSales;
    vm.ircAnnounceConfig = MeanTorrentConfig.meanTorrentConfig.ircAnnounce;
    vm.passwordConfig = MeanTorrentConfig.meanTorrentConfig.password;
    vm.examinationConfig = MeanTorrentConfig.meanTorrentConfig.examination;
    vm.chatConfig = MeanTorrentConfig.meanTorrentConfig.chat;

    vm.torrentType = MeanTorrentConfig.meanTorrentConfig.torrentType;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.vipTorrentType = localStorageService.get('vip_last_selected_type') || 'movie';

    vm.searchTags = [];
    vm.searchKey = '';
    vm.releaseYear = undefined;
    vm.filterHnR = false;
    vm.filterSale = false;

    uibButtonConfig.activeClass = 'btn-success';

    /**
     * getTemplateFileContent
     * @param file
     */
    vm.getTemplateFileContent = function (file) {
      $templateRequest(file, true).then(function (response) {
        vm.templateFileContent = response;
      });
    };

    /**
     * getTemplateMarkedContent
     * @returns {*}
     */
    vm.getTemplateMarkedContent = function () {
      var tmp = $filter('fmt')(vm.templateFileContent, {
        appConfig: vm.appConfig,
        supportConfig: vm.supportConfig,
        announceConfig: vm.announceConfig,
        scoreConfig: vm.scoreConfig,
        rssConfig: vm.rssConfig,
        ircConfig: vm.ircConfig,
        signConfig: vm.signConfig,
        inviteConfig: vm.inviteConfig,
        requestsConfig: vm.requestsConfig,
        hnrConfig: vm.hnrConfig,
        tmdbConfig: vm.tmdbConfig,
        salesTypeConfig: vm.salesTypeConfig,
        salesGlobalConfig: vm.salesGlobalConfig,
        ircAnnounceConfig: vm.ircAnnounceConfig,
        passwordConfig: vm.passwordConfig,
        examinationConfig: vm.examinationConfig,
        chatConfig: vm.chatConfig,

        user: vm.user
      });
      return marked(tmp, {sanitize: false});
    };

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
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.tooltipMsg = 'VIP.VIP_TORRENTS_IS_LOADING';
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
      vm.sortSize = undefined;
      vm.sortLife = undefined;

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

      vm.buildPager();
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

      vm.buildPager();
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
      TorrentsService.get({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage,
        sort: vm.sort,
        torrent_type: vm.vipTorrentType,
        torrent_status: 'reviewed',
        torrent_vip: true,
        keys: vm.searchKey.trim(),

        torrent_release: vm.releaseYear,
        torrent_tags: vm.searchTags,
        torrent_hnr: vm.filterHnR,
        torrent_sale: vm.filterSale
      }, function (data) {
        mtDebug.info(data);
        callback(data);
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('VIP.TORRENTS_LIST_ERROR')
        });
      });

      //make rss url
      vm.rssUrl = vm.appConfig.domain;
      vm.rssUrl += '/api/rss';
      vm.rssUrl += '/' + vm.user.passkey;
      vm.rssUrl += '?language=' + localStorageService.get('storage_user_lang');
      vm.rssUrl += '&limit=' + vm.itemsPerPage;
      vm.rssUrl += vm.searchKey.trim() ? '&keys=' + vm.searchKey.trim() : '';
      vm.rssUrl += '&torrent_type=' + vm.vipTorrentType;
      vm.rssUrl += vm.releaseYear ? '&torrent_release=' + vm.releaseYear : '';
      vm.rssUrl += vm.searchTags.length ? '&torrent_tags=' + vm.searchTags : '';
      vm.rssUrl += '&torrent_hnr=' + vm.filterHnR;
      vm.rssUrl += vm.filterSale ? '&torrent_sale=' + vm.filterSale : '';
      vm.rssUrl += '&torrent_vip=true';
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
     * onTypeBtnClick
     */
    vm.onTypeBtnClick = function () {
      localStorageService.set('vip_last_selected_type', vm.vipTorrentType);
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
      vm.buildPager();
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
      vm.buildPager();
    };

    /**
     * onKeysKeyDown
     * @param evt
     */
    vm.onKeysKeyDown = function (evt) {
      if (evt.keyCode === 13) {
        vm.buildPager();
      }
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
      vm.filterSale = false;

      vm.buildPager();
    };

    /**
     * onTagClicked
     * @param tag: tag name
     */
    vm.onTagClicked = function (tag) {
      $timeout(function () {
        angular.element('#tag_' + tag).trigger('click');
      }, 100);
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
      vm.buildPager();
    };

    /**
     * onHnRClicked
     */
    vm.onHnRClicked = function () {
      vm.filterHnR = !vm.filterHnR;
      vm.buildPager();
    };
    vm.onHnRChanged = function () {
      vm.buildPager();
    };

    /**
     * onSaleChanged
     */
    vm.onSaleClicked = function () {
      vm.filterSale = !vm.filterSale;
      vm.buildPager();
    };
    vm.onSaleChanged = function () {
      vm.buildPager();
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
     * getVipTooltip
     * @returns {*}
     */
    vm.getVipTooltip = function () {
      var ts = $translate.instant('HOME.VIP_TOOLTIP');

      return marked(ts, {sanitize: true});
    };
  }
}());
