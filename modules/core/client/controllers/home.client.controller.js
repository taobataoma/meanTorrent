(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'TorrentsService', 'NotifycationService', 'MeanTorrentConfig',
    'getStorageLangService', 'ForumsService', '$timeout', 'localStorageService', 'TopicsService', 'TorrentGetInfoServices', 'DebugConsoleService',
    'marked', 'CheckService', 'AlbumsService'];

  function HomeController($scope, $state, $translate, Authentication, TorrentsService, NotifycationService, MeanTorrentConfig, getStorageLangService,
                          ForumsService, $timeout, localStorageService, TopicsService, TorrentGetInfoServices, mtDebug,
                          marked, CheckService, AlbumsService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.TGI = TorrentGetInfoServices;
    vm.globalSalesConfig = MeanTorrentConfig.meanTorrentConfig.torrentGlobalSales;
    vm.examinationConfig = MeanTorrentConfig.meanTorrentConfig.examination;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.homeConfig = MeanTorrentConfig.meanTorrentConfig.home;
    vm.supportConfig = MeanTorrentConfig.meanTorrentConfig.support;
    vm.scoreConfig = MeanTorrentConfig.meanTorrentConfig.score;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;

    vm.searchType = 'torrents';
    vm.checkData = undefined;

    /**
     * window.resize()
     */
    $(window).resize(function () {
      vm.setAlbumItemHeight();
    });

    /**
     * initBodyBackground
     */
    vm.initBodyBackground = function () {
      var url = localStorageService.get('body_background_image') || vm.homeConfig.bodyBackgroundImage;
      $('.body-backdrop').css('backgroundImage', 'url("' + url + '")');

      TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'movie',
        torrent_vip: false,
        isTop: true,
        limit: 1
      }, function (items) {
        if (items.rows.length > 0) {
          var newUrl = vm.TGI.getTorrentBackdropImage(items.rows[0]);
          if (newUrl !== url) {
            $('.body-backdrop').css('backgroundImage', 'url("' + newUrl + '")');
            localStorageService.set('body_background_image', newUrl);
          }
        } else {
          TorrentsService.get({
            torrent_status: 'reviewed',
            torrent_type: 'movie',
            torrent_vip: false,
            limit: 1
          }, function (items) {
            if (items.rows.length > 0) {
              var newUrl = vm.TGI.getTorrentBackdropImage(items.rows[0]);
              if (newUrl !== url) {
                $('.body-backdrop').css('backgroundImage', 'url("' + newUrl + '")');
                localStorageService.set('body_background_image', newUrl);
              }
            }
          });

        }
      });
    };

    /**
     * setAlbumItemHeight
     */
    vm.setAlbumItemHeight = function () {
      $('.albums-item').height($('.albums-item').width() / 1.772);
    };

    /**
     * getCollectionsList
     */
    vm.getAlbumsList = function () {
      AlbumsService.query({
        isHomeStatus: true
      }, function (data) {
        vm.albumsList = data;
        mtDebug.info(data);

        $timeout(function () {
          vm.setAlbumItemHeight();
        }, 10);
      });
    };

    /**
     * getAlbumBackdropImage
     * @param item
     * @returns {string}
     */
    vm.getAlbumBackdropImage = function (item) {
      var result = null;

      if (item.backdrop_path) {
        result = vm.tmdbConfig.backdropImgBaseUrl + item.backdrop_path;
      } else if (item.cover) {
        result = '/modules/torrents/client/uploads/cover/' + item.cover;
      }
      return result;
    };

    /**
     * getForumList
     */
    vm.getForumList = function () {
      ForumsService.get({}, function (items) {
        vm.forums = items.forumsList;
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
          $state.go('torrents.aggregate', {keys: vm.searchKeys});
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
        e.slideDown(500);
        e.removeClass('panel-collapsed');
      }, 300);
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
        e.slideDown(500);
        e.removeClass('panel-collapsed');
      }, 300);
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
        e.slideDown(500);
        e.removeClass('panel-collapsed');
      }, 300);
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
        mtDebug.info(topics);
        vm.homeHelpTopics = topics;
      });
    };

    /**
     * getHomeNotice
     */
    vm.getHomeNotice = function () {
      TopicsService.getHomeNotice(function (topics) {
        mtDebug.info(topics);
        vm.homeNoticeTopics = topics;
      });
    };

    /**
     * getForumNewTopic
     */
    vm.getForumNewTopic = function () {
      TopicsService.getHomeNewTopic(function (topics) {
        mtDebug.info(topics);
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
        mtDebug.info(items);
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

    /**
     * getMyCheckData
     */
    vm.getMyCheckData = function () {
      CheckService.get(function (res) {
        mtDebug.info(res);
        vm.checkData = res;
        vm.openCheckTooltip();
      }, function (err) {
        vm.checkData = false;
        vm.openCheckTooltip();
      });
    };

    /**
     * checkIn
     */
    vm.checkIn = function () {
      CheckService.update(function (res) {
        mtDebug.info(res);
        vm.checkData = res;
        NotifycationService.showSuccessNotify('CHECK.CHECK_SUCCESSFULLY');
      }, function (err) {
        NotifycationService.showErrorNotify(err.data.message, 'CHECK.CHECK_ERROR');
      });
    };

    /**
     * getCheckTodayDoneMessage
     * @returns {*}
     */
    vm.getCheckTodayDoneMessage = function () {
      var ts = $translate.instant('CHECK.CHECK_TODAY_DONE', {
        keepDays: vm.checkData.keepDays,
        checkTime: vm.checkData.lastCheckedAt,
        todayScore: vm.scoreConfig.action.dailyCheckIn.dailyBasicScore + (vm.checkData.keepDays - 1) * vm.scoreConfig.action.dailyCheckIn.dailyStepScore,
        tomorrowScore: vm.scoreConfig.action.dailyCheckIn.dailyBasicScore + vm.checkData.keepDays * vm.scoreConfig.action.dailyCheckIn.dailyStepScore
      });

      return marked(ts, {sanitize: false});
    };

    /**
     * getCheckTodayNotMessage
     * @returns {*}
     */
    vm.getCheckTodayNotMessage = function () {
      var ts = $translate.instant('CHECK.CHECK_TODAY_NOT', {
        checkTime: vm.checkData.lastCheckedAt,
        todayScore: vm.scoreConfig.action.dailyCheckIn.dailyBasicScore + vm.checkData.keepDays * vm.scoreConfig.action.dailyCheckIn.dailyStepScore,
        tomorrowScore: vm.scoreConfig.action.dailyCheckIn.dailyBasicScore + (vm.checkData.keepDays + 1) * vm.scoreConfig.action.dailyCheckIn.dailyStepScore
      });

      return marked(ts, {sanitize: false});
    };

    /**
     * getCheckTooltipMessage
     * @returns {*}
     */
    vm.getCheckTooltipMessage = function () {
      var ts = $translate.instant('CHECK.CHECK_TOOLTIP', {
        todayScore: vm.scoreConfig.action.dailyCheckIn.dailyBasicScore,
        tomorrowScore: vm.scoreConfig.action.dailyCheckIn.dailyBasicScore + vm.scoreConfig.action.dailyCheckIn.dailyStepScore
      });

      return marked(ts, {sanitize: false});
    };

    /**
     * openCheckTooltip
     */
    vm.openCheckTooltip = function () {
      var e = $('.home-check-in');

      $timeout(function () {
        e.slideDown(500);
        e.removeClass('panel-collapsed');
      }, 300);
    };

  }
}());
