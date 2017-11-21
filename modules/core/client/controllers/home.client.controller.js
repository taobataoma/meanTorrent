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
     * getMovieTopInfo
     */
    vm.getMovieTopInfo = function () {
      vm.moviesInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'movie',
        limit: 9
      }, function (items) {
        if (items.rows.length > 0) {
          vm.movieTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.movieTopList = items.rows;

          vm.initTopOneMovieInfo();

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.movieTopOne);
            ScrapeService.scrapeTorrent(vm.movieTopList);
          }
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TOP_MOVIE_INFO_ERROR')
        });
      });

      vm.moviesInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'movie',
        newest: true,
        limit: 14
      }, function (items) {
        if (items.rows.length > 0) {
          vm.movieNewList = items.rows;

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.movieNewList);
          }
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
        limit: 9
      }, function (items) {
        if (items.rows.length > 0) {
          vm.TVTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.TVTopList = items.rows;

          vm.initTopOneTVInfo();

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.TVTopOne);
            ScrapeService.scrapeTorrent(vm.TVTopList);
          }
        }
      });

      vm.tvsInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'tvserial',
        newest: true,
        limit: 14
      }, function (items) {
        if (items.rows.length > 0) {
          vm.TVNewList = items.rows;

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.TVNewList);
          }
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
        limit: 9
      }, function (items) {
        if (items.rows.length > 0) {
          vm.musicTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.musicTopList = items.rows;

          vm.initTopOneMusicInfo();

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.musicTopOne);
            ScrapeService.scrapeTorrent(vm.musicTopList);
          }
        }
      });

      vm.musicInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'music',
        newest: true,
        limit: 13
      }, function (items) {
        if (items.rows.length > 0) {
          vm.musicNewList = items.rows;

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.musicNewList);
          }
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
        limit: 9
      }, function (items) {
        if (items.rows.length > 0) {
          vm.sportsTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.sportsTopList = items.rows;

          vm.initTopOneSportsInfo();

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.sportsTopOne);
            ScrapeService.scrapeTorrent(vm.sportsTopList);
          }
        }
      });

      vm.sportsInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'sports',
        newest: true,
        limit: 14
      }, function (items) {
        if (items.rows.length > 0) {
          vm.sportsNewList = items.rows;

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.sportsNewList);
          }
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
        limit: 9
      }, function (items) {
        if (items.rows.length > 0) {
          vm.varietyTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.varietyTopList = items.rows;

          vm.initTopOneVarietyInfo();

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.varietyTopOne);
            ScrapeService.scrapeTorrent(vm.varietyTopList);
          }
        }
      });

      vm.varietyInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'variety',
        newest: true,
        limit: 14
      }, function (items) {
        if (items.rows.length > 0) {
          vm.varietyNewList = items.rows;

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.varietyNewList);
          }
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
        limit: 9
      }, function (items) {
        if (items.rows.length > 0) {
          vm.pictureTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.pictureTopList = items.rows;

          vm.initTopOnePictureInfo();

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.pictureTopOne);
            ScrapeService.scrapeTorrent(vm.pictureTopList);
          }
        }
      });

      vm.pictureInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'picture',
        newest: true,
        limit: 14
      }, function (items) {
        if (items.rows.length > 0) {
          vm.pictureNewList = items.rows;

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.pictureNewList);
          }
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
        limit: 9
      }, function (items) {
        if (items.rows.length > 0) {
          vm.gameTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.gameTopList = items.rows;

          vm.initTopOneGameInfo();

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.gameTopOne);
            ScrapeService.scrapeTorrent(vm.gameTopList);
          }
        }
      });

      vm.gameInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'game',
        newest: true,
        limit: 14
      }, function (items) {
        if (items.rows.length > 0) {
          vm.gameNewList = items.rows;

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.gameNewList);
          }
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
        limit: 9
      }, function (items) {
        if (items.rows.length > 0) {
          vm.softwareTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.softwareTopList = items.rows;

          vm.initTopOneSoftwareInfo();

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.softwareTopOne);
            ScrapeService.scrapeTorrent(vm.softwareTopList);
          }
        }
      });

      vm.softwareInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'software',
        newest: true,
        limit: 14
      }, function (items) {
        if (items.rows.length > 0) {
          vm.softwareNewList = items.rows;

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.softwareNewList);
          }
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
        limit: 9
      }, function (items) {
        if (items.rows.length > 0) {
          vm.ebookTopOne = items.rows[0];
          items.rows.splice(0, 1);
          vm.ebookTopList = items.rows;

          vm.initTopOneEbookInfo();

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.ebookTopOne);
            ScrapeService.scrapeTorrent(vm.ebookTopList);
          }
        }
      });

      vm.ebookInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'ebook',
        newest: true,
        limit: 14
      }, function (items) {
        if (items.rows.length > 0) {
          vm.ebookNewList = items.rows;

          if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInHome) {
            ScrapeService.scrapeTorrent(vm.ebookNewList);
          }
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
