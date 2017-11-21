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
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.scrapeConfig = MeanTorrentConfig.meanTorrentConfig.scrapeTorrentStatus;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.torrentType = MeanTorrentConfig.meanTorrentConfig.torrentType;

    vm.movieTopOne = undefined;
    vm.movieTopList = undefined;
    vm.movieNewList = undefined;

    vm.TVTopOne = undefined;
    vm.TVTopList = undefined;
    vm.TVNewList = undefined;

    $(document).ready(function () {
      $('#warning_popup').popup({
        outline: false,
        focusdelay: 400,
        vertical: 'top',
        autoopen: false,
        opacity: 0.6,
        closetransitionend: function () {
          $('.popup_wrapper').remove();
        }
      });
    });

    /**
     * initTopOneInfo
     */
    vm.initTopOneMovieInfo = function () {
      if (vm.movieTopOne.resource_detail_info.backdrop_path) {
        $('.movie-backdrop').css('backgroundImage', 'url(' + vm.tmdbConfig.backdropImgBaseUrl + vm.movieTopOne.resource_detail_info.backdrop_path + ')');
      }
    };

    /**
     * initTopOneTVInfo
     */
    vm.initTopOneTVInfo = function () {
      if (vm.TVTopOne.resource_detail_info.backdrop_path) {
        $('.tv-backdrop').css('backgroundImage', 'url(' + vm.tmdbConfig.backdropImgBaseUrl + vm.TVTopOne.resource_detail_info.backdrop_path + ')');
      }
    };

    /**
     * initTopOneMusicInfo
     */
    vm.initTopOneMusicInfo = function () {
      if (vm.musicTopOne.resource_detail_info.cover) {
        $('.music-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.musicTopOne.resource_detail_info.cover + '")');
      }
    };

    /**
     * initTopOneSportsInfo
     */
    vm.initTopOneSportsInfo = function () {
      if (vm.sportsTopOne.resource_detail_info.cover) {
        $('.sports-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.sportsTopOne.resource_detail_info.cover + '")');
      }
    };

    /**
     * initTopOneVarietyInfo
     */
    vm.initTopOneVarietyInfo = function () {
      if (vm.varietyTopOne.resource_detail_info.cover) {
        $('.variety-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.varietyTopOne.resource_detail_info.cover + '")');
      }
    };

    /**
     * initTopOnePictureInfo
     */
    vm.initTopOnePictureInfo = function () {
      if (vm.pictureTopOne.resource_detail_info.cover) {
        $('.picture-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.pictureTopOne.resource_detail_info.cover + '")');
      }
    };

    /**
     * initTopOneGameInfo
     */
    vm.initTopOneGameInfo = function () {
      if (vm.gameTopOne.resource_detail_info.cover) {
        $('.game-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.gameTopOne.resource_detail_info.cover + '")');
      }
    };

    /**
     * initTopOneSoftwareInfo
     */
    vm.initTopOneSoftwareInfo = function () {
      if (vm.softwareTopOne.resource_detail_info.cover) {
        $('.software-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.softwareTopOne.resource_detail_info.cover + '")');
      }
    };

    /**
     * initTopOneEbookInfo
     */
    vm.initTopOneEbookInfo = function () {
      if (vm.ebookTopOne.resource_detail_info.cover) {
        $('.ebook-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.ebookTopOne.resource_detail_info.cover + '")');
      }
    };

    /**
     * getTorrentTypeEnabled
     */
    vm.getTorrentTypeEnabled = function (t) {
      var enb = false;
      angular.forEach(vm.torrentType.value, function (tc) {
        if (tc.value === t) {
          enb = tc.enable && tc.showTopListInHome;
        }
      });
      return enb;
    };

    /**
     * getWarningInfo
     */
    vm.getWarningInfo = function () {
      var sw = localStorageService.get('showed_warning');
      if (vm.appConfig.showDemoWarningPopup && !sw) {
        $timeout(function () {
          $('#warning_popup').popup('show');
          //$('.warning_popup_open').trigger('click');
          //angular.element('#myselector').triggerHandler('click');
        }, 300);

        localStorageService.set('showed_warning', true);
      }
      if (sw) {
        $('.popup_wrapper').remove();
      }
    };

    /**
     * getHomeTorrentList
     */
    vm.getHomeTorrentList = function () {
      vm.homeTorrents = TorrentsService.getHomeTorrent({}, function (items) {
        vm.orderList = items.orderList;
        vm.newestList = items.newestList;

        vm.initListData();

        if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
          ScrapeService.scrapeTorrent(vm.orderList);
          ScrapeService.scrapeTorrent(vm.newestList);
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TOP_TORRENTS_INFO_ERROR')
        });
      });
    };

    /**
     * initListData
     * @param t
     */
    vm.initListData = function () {
      angular.forEach(vm.orderList, function (i) {
        switch (i._id) {
          case 'movie':
            vm.movieTopOne = i.typeTorrents[0] || undefined;
            vm.movieTopList = i.typeTorrents.splice(1, 8) || undefined;
            vm.initTopOneMovieInfo();
            break;
          case 'tvserial':
            vm.TVTopOne = i.typeTorrents[0] || undefined;
            vm.TVTopList = i.typeTorrents.splice(1, 8) || undefined;
            vm.initTopOneTVInfo();
            break;
          case 'music':
            vm.musicTopOne = i.typeTorrents[0] || undefined;
            vm.musicTopList = i.typeTorrents.splice(1, 8) || undefined;
            vm.initTopOneMusicInfo();
            break;
          case 'sports':
            vm.sportsTopOne = i.typeTorrents[0] || undefined;
            vm.sportsTopList = i.typeTorrents.splice(1, 8) || undefined;
            vm.initTopOneSportsInfo();
            break;
          case 'variety':
            vm.varietyTopOne = i.typeTorrents[0] || undefined;
            vm.varietyTopList = i.typeTorrents.splice(1, 8) || undefined;
            vm.initTopOneVarietyInfo();
            break;
          case 'picture':
            vm.pictureTopOne = i.typeTorrents[0] || undefined;
            vm.pictureTopList = i.typeTorrents.splice(1, 8) || undefined;
            vm.initTopOnePictureInfo();
            break;
          case 'game':
            vm.gameTopOne = i.typeTorrents[0] || undefined;
            vm.gameTopList = i.typeTorrents.splice(1, 8) || undefined;
            vm.initTopOneGameInfo();
            break;
          case 'software':
            vm.softwareTopOne = i.typeTorrents[0] || undefined;
            vm.softwareTopList = i.typeTorrents.splice(1, 8) || undefined;
            vm.initTopOneSoftwareInfo();
            break;
          case 'ebook':
            vm.ebookTopOne = i.typeTorrents[0] || undefined;
            vm.ebookTopList = i.typeTorrents.splice(1, 8) || undefined;
            vm.initTopOneEbookInfo();
            break;
        }
      });
      angular.forEach(vm.newestList, function (i) {
        switch (i._id) {
          case 'movie':
            vm.movieNewList = i.typeTorrents.splice(0, 14) || undefined;
            break;
          case 'tvserial':
            vm.TVNewList = i.typeTorrents.splice(0, 14) || undefined;
            break;
          case 'music':
            vm.musicNewList = i.typeTorrents.splice(0, 13) || undefined;
            break;
          case 'sports':
            vm.sportsNewList = i.typeTorrents.splice(0, 14) || undefined;
            break;
          case 'variety':
            vm.varietyNewList = i.typeTorrents.splice(0, 14) || undefined;
            break;
          case 'picture':
            vm.pictureNewList = i.typeTorrents.splice(0, 14) || undefined;
            break;
          case 'game':
            vm.gameNewList = i.typeTorrents.splice(0, 14) || undefined;
            break;
          case 'software':
            vm.softwareNewList = i.typeTorrents.splice(0, 14) || undefined;
            break;
          case 'ebook':
            vm.ebookNewList = i.typeTorrents.splice(0, 14) || undefined;
            break;
        }
      });
    };

    /**
     * getOverviewMarkedContent
     * @param t
     * @returns {*}
     */
    vm.getOverviewMarkedContent = function (c) {
      if (c) {
        return marked(c, {sanitize: true});
      } else {
        return '';
      }
    };
  }
}());
