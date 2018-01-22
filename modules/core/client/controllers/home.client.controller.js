(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'TorrentsService', 'Notification', 'MeanTorrentConfig',
    'getStorageLangService', 'DownloadService', '$timeout', 'localStorageService', 'ScrapeService', 'TorrentGetInfoServices', 'DebugConsoleService',
    'marked'];

  function HomeController($scope, $state, $translate, Authentication, TorrentsService, Notification, MeanTorrentConfig, getStorageLangService,
                          DownloadService, $timeout, localStorageService, ScrapeService, TorrentGetInfoServices, mtDebug,
                          marked) {
    var vm = this;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.globalSalesConfig = MeanTorrentConfig.meanTorrentConfig.torrentGlobalSales;

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

      if (now > showat && now < end) {
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
    }
  }
}());
