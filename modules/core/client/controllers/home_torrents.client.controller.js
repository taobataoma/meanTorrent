(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeTorrentsController', HomeTorrentsController);

  HomeTorrentsController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'TorrentsService', 'Notification', 'MeanTorrentConfig',
    'getStorageLangService', 'DownloadService', '$timeout', 'localStorageService', 'TorrentGetInfoServices', 'DebugConsoleService',
    'marked'];

  function HomeTorrentsController($scope, $state, $translate, Authentication, TorrentsService, Notification, MeanTorrentConfig, getStorageLangService,
                                  DownloadService, $timeout, localStorageService, TorrentGetInfoServices, mtDebug,
                                  marked) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.torrentType = MeanTorrentConfig.meanTorrentConfig.torrentType;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

    vm.movieTopOne = undefined;
    vm.movieTopList = undefined;
    vm.movieNewList = undefined;

    vm.TVTopOne = undefined;
    vm.TVTopList = undefined;
    vm.TVNewList = undefined;

    /**
     * initTopOneInfo
     */
    vm.initTopOneMovieInfo = function () {
      $timeout(function () {
        if (vm.movieTopOne.resource_detail_info.backdrop_path) {
          $('.movie-backdrop').css('backgroundImage', 'url(' + vm.tmdbConfig.backdropImgBaseUrl + vm.movieTopOne.resource_detail_info.backdrop_path + ')');
        }
      }, 10);
    };

    /**
     * initTopOneTVInfo
     */
    vm.initTopOneTVInfo = function () {
      $timeout(function () {
        if (vm.TVTopOne.resource_detail_info.backdrop_path) {
          $('.tv-backdrop').css('backgroundImage', 'url(' + vm.tmdbConfig.backdropImgBaseUrl + vm.TVTopOne.resource_detail_info.backdrop_path + ')');
        }
      }, 10);
    };

    /**
     * initTopOneMusicInfo
     */
    vm.initTopOneMusicInfo = function () {
      $timeout(function () {
        if (vm.musicTopOne.resource_detail_info.cover) {
          $('.music-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.musicTopOne.resource_detail_info.cover + '")');
        }
      }, 10);
    };

    /**
     * initTopOneSportsInfo
     */
    vm.initTopOneSportsInfo = function () {
      $timeout(function () {
        if (vm.sportsTopOne.resource_detail_info.cover) {
          $('.sports-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.sportsTopOne.resource_detail_info.cover + '")');
        }
      }, 10);
    };

    /**
     * initTopOneVarietyInfo
     */
    vm.initTopOneVarietyInfo = function () {
      $timeout(function () {
        if (vm.varietyTopOne.resource_detail_info.cover) {
          $('.variety-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.varietyTopOne.resource_detail_info.cover + '")');
        }
      }, 10);
    };

    /**
     * initTopOnePictureInfo
     */
    vm.initTopOnePictureInfo = function () {
      $timeout(function () {
        if (vm.pictureTopOne.resource_detail_info.cover) {
          $('.picture-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.pictureTopOne.resource_detail_info.cover + '")');
        }
      }, 10);
    };

    /**
     * initTopOneGameInfo
     */
    vm.initTopOneGameInfo = function () {
      $timeout(function () {
        if (vm.gameTopOne.resource_detail_info.cover) {
          $('.game-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.gameTopOne.resource_detail_info.cover + '")');
        }
      }, 10);
    };

    /**
     * initTopOneSoftwareInfo
     */
    vm.initTopOneSoftwareInfo = function () {
      $timeout(function () {
        if (vm.softwareTopOne.resource_detail_info.cover) {
          $('.software-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.softwareTopOne.resource_detail_info.cover + '")');
        }
      }, 10);
    };

    /**
     * initTopOneEbookInfo
     */
    vm.initTopOneEbookInfo = function () {
      $timeout(function () {
        if (vm.ebookTopOne.resource_detail_info.cover) {
          $('.ebook-backdrop').css('backgroundImage', 'url("/modules/torrents/client/uploads/cover/' + vm.ebookTopOne.resource_detail_info.cover + '")');
        }
      }, 10);
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
     * getMovieTopInfo
     */
    vm.getMovieTopInfo = function () {
      vm.moviesInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'movie',
        torrent_vip: false,
        limit: 9,
        isHome: true
      }, function (items) {
        if (items.rows.length > 0) {
          vm.movieTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.movieTopList = items.rows;

          vm.initTopOneMovieInfo();
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TOP_MOVIE_INFO_ERROR')
        });
      });

      vm.moviesInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'movie',
        torrent_vip: false,
        newest: true,
        limit: vm.itemsPerPageConfig.homeNewestTorrentListPerType
      }, function (items) {
        if (items.rows.length > 0) {
          vm.movieNewList = items.rows;
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TOP_MOVIE_INFO_ERROR')
        });
      });
    };

    /**
     * getTVTopInfo
     */
    vm.getTVTopInfo = function () {
      vm.tvsInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'tvserial',
        torrent_vip: false,
        limit: 9,
        isHome: true
      }, function (items) {
        if (items.rows.length > 0) {
          vm.TVTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.TVTopList = items.rows;

          vm.initTopOneTVInfo();
        }
      });

      vm.tvsInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'tvserial',
        torrent_vip: false,
        newest: true,
        limit: vm.itemsPerPageConfig.homeNewestTorrentListPerType
      }, function (items) {
        if (items.rows.length > 0) {
          vm.TVNewList = items.rows;
        }
      });
    };

    /**
     * getMusicTopInfo
     */
    vm.getMusicTopInfo = function () {
      vm.musicInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'music',
        torrent_vip: false,
        limit: 9,
        isHome: true
      }, function (items) {
        if (items.rows.length > 0) {
          vm.musicTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.musicTopList = items.rows;

          vm.initTopOneMusicInfo();
        }
      });

      vm.musicInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'music',
        torrent_vip: false,
        newest: true,
        limit: vm.itemsPerPageConfig.homeNewestTorrentListPerType - 1
      }, function (items) {
        if (items.rows.length > 0) {
          vm.musicNewList = items.rows;
        }
      });
    };

    /**
     * getSportsTopInfo
     */
    vm.getSportsTopInfo = function () {
      vm.sportsInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'sports',
        torrent_vip: false,
        limit: 9,
        isHome: true
      }, function (items) {
        if (items.rows.length > 0) {
          vm.sportsTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.sportsTopList = items.rows;

          vm.initTopOneSportsInfo();
        }
      });

      vm.sportsInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'sports',
        torrent_vip: false,
        newest: true,
        limit: vm.itemsPerPageConfig.homeNewestTorrentListPerType
      }, function (items) {
        if (items.rows.length > 0) {
          vm.sportsNewList = items.rows;
        }
      });
    };

    /**
     * getVarietyTopInfo
     */
    vm.getVarietyTopInfo = function () {
      vm.varietyInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'variety',
        torrent_vip: false,
        limit: 9,
        isHome: true
      }, function (items) {
        if (items.rows.length > 0) {
          vm.varietyTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.varietyTopList = items.rows;

          vm.initTopOneVarietyInfo();
        }
      });

      vm.varietyInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'variety',
        torrent_vip: false,
        newest: true,
        limit: vm.itemsPerPageConfig.homeNewestTorrentListPerType
      }, function (items) {
        if (items.rows.length > 0) {
          vm.varietyNewList = items.rows;
        }
      });
    };

    /**
     * getPictureTopInfo
     */
    vm.getPictureTopInfo = function () {
      vm.pictureInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'picture',
        torrent_vip: false,
        limit: 9,
        isHome: true
      }, function (items) {
        if (items.rows.length > 0) {
          vm.pictureTopOne = items.rows[0];
          console.log(vm.pictureTopOne);
          items.rows.splice(0, 1);
          vm.pictureTopList = items.rows;

          vm.initTopOnePictureInfo();
        }
      });

      vm.pictureInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'picture',
        torrent_vip: false,
        newest: true,
        limit: vm.itemsPerPageConfig.homeNewestTorrentListPerType
      }, function (items) {
        if (items.rows.length > 0) {
          vm.pictureNewList = items.rows;
        }
      });
    };

    /**
     * getGameTopInfo
     */
    vm.getGameTopInfo = function () {
      vm.gameInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'game',
        torrent_vip: false,
        limit: 9,
        isHome: true
      }, function (items) {
        if (items.rows.length > 0) {
          vm.gameTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.gameTopList = items.rows;

          vm.initTopOneGameInfo();
        }
      });

      vm.gameInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'game',
        torrent_vip: false,
        newest: true,
        limit: vm.itemsPerPageConfig.homeNewestTorrentListPerType
      }, function (items) {
        if (items.rows.length > 0) {
          vm.gameNewList = items.rows;
        }
      });
    };

    /**
     * getSoftwareTopInfo
     */
    vm.getSoftwareTopInfo = function () {
      vm.softwareInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'software',
        torrent_vip: false,
        limit: 9,
        isHome: true
      }, function (items) {
        if (items.rows.length > 0) {
          vm.softwareTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.softwareTopList = items.rows;

          vm.initTopOneSoftwareInfo();
        }
      });

      vm.softwareInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'software',
        torrent_vip: false,
        newest: true,
        limit: vm.itemsPerPageConfig.homeNewestTorrentListPerType
      }, function (items) {
        if (items.rows.length > 0) {
          vm.softwareNewList = items.rows;
        }
      });
    };

    /**
     * getEbookTopInfo
     */
    vm.getEbookTopInfo = function () {
      vm.ebookInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'ebook',
        torrent_vip: false,
        limit: 9,
        isHome: true
      }, function (items) {
        if (items.rows.length > 0) {
          vm.ebookTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.ebookTopList = items.rows;

          vm.initTopOneEbookInfo();
        }
      });

      vm.ebookInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'ebook',
        torrent_vip: false,
        newest: true,
        limit: vm.itemsPerPageConfig.homeNewestTorrentListPerType
      }, function (items) {
        if (items.rows.length > 0) {
          vm.ebookNewList = items.rows;
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
