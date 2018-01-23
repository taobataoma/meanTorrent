(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'TorrentsService', 'Notification', 'MeanTorrentConfig',
    'getStorageLangService', 'DownloadService', '$timeout', 'localStorageService', 'TopicsService', 'TorrentGetInfoServices', 'DebugConsoleService',
    'marked'];

  function HomeController($scope, $state, $translate, Authentication, TorrentsService, Notification, MeanTorrentConfig, getStorageLangService,
                          DownloadService, $timeout, localStorageService, TopicsService, TorrentGetInfoServices, mtDebug,
                          marked) {
    var vm = this;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.globalSalesConfig = MeanTorrentConfig.meanTorrentConfig.torrentGlobalSales;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;

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
        console.log(topics);
        vm.homeHelpTopics = topics;
      });
    };

    /**
     * getHomeNotice
     */
    vm.getHomeNotice = function () {
      TopicsService.getHomeNotice(function (topics) {
        console.log(topics);
        vm.homeNoticeTopics = topics;
      });
    };

    /**
     * getForumNewTopic
     */
    vm.getForumNewTopic = function () {
      TopicsService.getHomeNewTopic(function (topics) {
        console.log(topics);
        vm.homeNewTopics = topics;
      });
    };
  }
}());
