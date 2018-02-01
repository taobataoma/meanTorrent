(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'TorrentsService', 'Notification', 'MeanTorrentConfig',
    'getStorageLangService', 'ForumsService', '$timeout', 'localStorageService', 'TopicsService', 'TorrentGetInfoServices', 'DebugConsoleService',
    'marked'];

  function HomeController($scope, $state, $translate, Authentication, TorrentsService, Notification, MeanTorrentConfig, getStorageLangService,
                          ForumsService, $timeout, localStorageService, TopicsService, TorrentGetInfoServices, mtDebug,
                          marked) {
    var vm = this;
    vm.user = Authentication.user;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.TGI = TorrentGetInfoServices;
    vm.globalSalesConfig = MeanTorrentConfig.meanTorrentConfig.torrentGlobalSales;
    vm.examinationConfig = MeanTorrentConfig.meanTorrentConfig.examination;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;

    vm.searchType = 'torrents';

    /**
     * getForumList
     */
    vm.getForumList = function () {
      ForumsService.get({}, function (items) {
        vm.forums = items.forumsList;
        console.log(items);
      });
    };

    /**
     * doGlobalSearch
     */
    vm.doGlobalSearch = function () {
      if (vm.searchKeys) {
        if (vm.searchType === 'forum') {     //search from forum
          var fid = [];

          angular.forEach(vm.forums, function (f) {
            fid.push(f._id);
          });

          $state.go('forums.search', {forumId: fid, keys: vm.searchKeys});
        } else {                            //search from torrents
          $state.go('torrents.search', {keys: vm.searchKeys});
        }
      }
    };

    /**
     * onSearchKeyDown
     * @param evt
     */
    vm.onSearchKeyDown = function (evt) {
      if (evt.keyCode === 13 && vm.searchKeys) {
        vm.doGlobalSearch();
      }
    };

    /**
     * getSaleNoticeMessage
     * @returns {*}
     */
    vm.getSaleNoticeMessage = function () {
      var start = moment(vm.globalSalesConfig.global.startAt, vm.globalSalesConfig.global.timeFormats).valueOf();
      var end = start + vm.globalSalesConfig.global.expires;
      var ts = $translate.instant('SITE_NOTICE.GLOBAL_SALES_NOTICE', {
        site_name: vm.appConfig.name,
        sale_value: vm.globalSalesConfig.global.value,
        sale_start_at: start,
        sale_end_at: end,
        sale_days: vm.globalSalesConfig.global.expires / (60 * 60 * 1000 * 24)
      });

      return marked(ts, {sanitize: false});
    };

    /**
     * showSaleNotice
     * @returns {boolean}
     */
    vm.showSaleNotice = function () {
      var showat = moment(vm.globalSalesConfig.global.noticeShowAt, vm.globalSalesConfig.global.timeFormats).valueOf();
      var start = moment(vm.globalSalesConfig.global.startAt, vm.globalSalesConfig.global.timeFormats).valueOf();
      var end = start + vm.globalSalesConfig.global.expires;
      var now = Date.now();

      if (now > showat && now < end && vm.globalSalesConfig.global.value) {
        return true;
      } else {
        return false;
      }
    };

    /**
     * openSalesNotice
     */
    vm.openSalesNotice = function () {
      var e = $('.sales_notice');

      $timeout(function () {
        e.slideDown(800);
        e.removeClass('panel-collapsed');
      }, 1000);
    };

    /**
     * getExaminationNoticeMessage
     * @returns {*}
     */
    vm.getExaminationNoticeMessage = function () {
      var start = moment(vm.examinationConfig.timeSet.startAt, vm.examinationConfig.timeSet.timeFormats).valueOf();
      var end = moment(vm.examinationConfig.timeSet.endAt, vm.examinationConfig.timeSet.timeFormats).valueOf();
      var ts = $translate.instant('SITE_NOTICE.EXAMINATION_NOTICE', {
        site_name: vm.appConfig.name,
        examination_start_at: start,
        examination_end_at: end,
        data_upload: vm.examinationConfig.incrementData.upload,
        data_download: vm.examinationConfig.incrementData.download,
        data_score: vm.examinationConfig.incrementData.score,
        join_days: vm.announceConfig.downloadCheck.checkAfterSignupDays,
        detail_url: vm.examinationConfig.detailUrl
      });

      return marked(ts, {sanitize: false});
    };

    /**
     * showExaminationNotice
     * @returns {boolean}
     */
    vm.showExaminationNotice = function () {
      var showat = moment(vm.examinationConfig.timeSet.noticeShowAt, vm.examinationConfig.timeSet.timeFormats).valueOf();
      var start = moment(vm.examinationConfig.timeSet.startAt, vm.examinationConfig.timeSet.timeFormats).valueOf();
      var now = Date.now();

      if (now > showat && now < start) {
        return true;
      } else {
        return false;
      }
    };

    /**
     * openExaminationNotice
     */
    vm.openExaminationNotice = function () {
      var e = $('.examination_notice');

      $timeout(function () {
        e.slideDown(800);
        e.removeClass('panel-collapsed');
      }, 1000);
    };

    /**
     * getExaminationStatusMessage
     * @returns {*}
     */
    vm.getExaminationStatusMessage = function () {
      var start = moment(vm.examinationConfig.timeSet.startAt, vm.examinationConfig.timeSet.timeFormats).valueOf();
      var end = moment(vm.examinationConfig.timeSet.endAt, vm.examinationConfig.timeSet.timeFormats).valueOf();
      var ts = $translate.instant('SITE_NOTICE.EXAMINATION_STATUS', {
        site_name: vm.appConfig.name,
        examination_start_at: start,
        examination_end_at: end,
        data_upload: vm.examinationConfig.incrementData.upload,
        data_download: vm.examinationConfig.incrementData.download,
        data_score: vm.examinationConfig.incrementData.score,
        finished_upload: vm.user.examinationData.uploaded,
        finished_download: vm.user.examinationData.downloaded,
        finished_score: vm.user.examinationData.score || '-',
        data_status: vm.user.examinationData.isFinished ? 'SITE_NOTICE.EXAMINATION_FINISHED' : 'SITE_NOTICE.EXAMINATION_UNFINISHED',
        detail_url: vm.examinationConfig.detailUrl
      });

      return marked(ts, {sanitize: false});
    };

    /**
     * showExaminationStatus
     * @returns {boolean}
     */
    vm.showExaminationStatus = function () {
      var start = moment(vm.examinationConfig.timeSet.startAt, vm.examinationConfig.timeSet.timeFormats).valueOf();
      var end = moment(vm.examinationConfig.timeSet.endAt, vm.examinationConfig.timeSet.timeFormats).valueOf();
      var now = Date.now();

      if (now > start && now < end && vm.user && vm.user.examinationData) {
        return true;
      } else {
        return false;
      }
    };

    /**
     * openExaminationStatus
     */
    vm.openExaminationStatus = function () {
      var e = $('.examination_status');

      $timeout(function () {
        e.slideDown(800);
        e.removeClass('panel-collapsed');
      }, 1000);
    };

    /**
     * onCloseNoticeClicked
     * @param cls
     */
    vm.onCloseNoticeClicked = function (cls) {
      var e = $('.' + cls);

      $timeout(function () {
        e.slideUp(800);
        e.addClass('panel-collapsed');
      }, 100);
    };

    /**
     * getHomeHelp
     */
    vm.getHomeHelp = function () {
      TopicsService.getHomeHelp(function (topics) {
        vm.homeHelpTopics = topics;
      });
    };

    /**
     * getHomeNotice
     */
    vm.getHomeNotice = function () {
      TopicsService.getHomeNotice(function (topics) {
        vm.homeNoticeTopics = topics;
      });
    };

    /**
     * getForumNewTopic
     */
    vm.getForumNewTopic = function () {
      TopicsService.getHomeNewTopic(function (topics) {
        vm.homeNewTopics = topics;
      });
    };

    /**
     * getNewestTorrents
     */
    vm.getNewestTorrents = function () {
      TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'all',
        torrent_vip: false,
        newest: true,
        limit: vm.itemsPerPageConfig.homeNewestTorrentsListLimit
      }, function (items) {
        if (items.rows.length > 0) {
          vm.homeNewestTorrents = items.rows;
        }
      });
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
