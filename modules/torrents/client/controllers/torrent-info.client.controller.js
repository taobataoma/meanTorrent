(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsInfoController', TorrentsInfoController);

  TorrentsInfoController.$inject = ['$scope', '$state', '$stateParams', '$translate', 'Authentication', 'Notification', 'TorrentsService',
    'MeanTorrentConfig', 'DownloadService', '$sce', '$filter'];

  function TorrentsInfoController($scope, $state, $stateParams, $translate, Authentication, Notification, TorrentsService, MeanTorrentConfig,
                                  DownloadService, $sce, $filter) {
    var vm = this;
    vm.user = Authentication.user;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.imdbConfig = MeanTorrentConfig.meanTorrentConfig.imdbConfig;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;

    vm.torrentTabs = [];

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * getTorrentInfo
     */
    vm.getTorrentInfo = function () {
      vm.torrentLocalInfo = TorrentsService.get({
        torrentId: $stateParams.torrentId
      }, function (res) {
        if (res.torrent_backdrop_img) {
          $('.backdrop').css('backgroundImage', 'url(' + vm.tmdbConfig.backdrop_img_base_url + res.torrent_backdrop_img + ')');
        }
        vm.initInfo(res.torrent_tmdb_id);

        vm.torrentTabs.push(
          {
            title: $translate.instant('TAB_VIDEO_INFO'),
            templateUrl: 'videoInfo.html',
            ng_show: true,
            badges: []
          },
          {
            title: $translate.instant('TAB_USER_SUBTITLE'),
            templateUrl: 'subtitleInfo.html',
            ng_show: true,
            badges: [
              {
                value: vm.torrentLocalInfo._subtitles.length,
                class: 'badge_info'
              }
            ]
          },
          {
            title: $translate.instant('TAB_USER_INFO'),
            templateUrl: 'userInfo.html',
            ng_show: true,
            badges: [
              {
                value: '↑ ' + vm.torrentLocalInfo.torrent_seeds + '　↓ ' + vm.torrentLocalInfo.torrent_leechers + '　√ ' + vm.torrentLocalInfo.torrent_finished,
                class: 'badge_info'
              }
            ]
          },
          {
            title: $translate.instant('TAB_OTHER_TORRENTS'),
            templateUrl: 'otherTorrents.html',
            ng_show: true,
            badges: []
          },
          {
            title: $translate.instant('TAB_MY_PANEL'),
            templateUrl: 'myPanel.html',
            ng_show: vm.torrentLocalInfo.isCurrentUserOwner,
            badges: []
          },
          {
            title: $translate.instant('TAB_ADMIN_PANEL'),
            templateUrl: 'adminPanel.html',
            ng_show: vm.user.roles.indexOf('admin') >= 0,
            badges: []
          }
        );
      });

      console.log(vm.torrentLocalInfo);
    };

    /**
     * initInfo
     */
    vm.initInfo = function (tmdb_id) {
      TorrentsService.getTMDBInfo({
        tmdbid: tmdb_id,
        language: 'en'
      }, function (res) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TMDB_INFO_OK')
        });

        console.log(res);
        vm.movieinfo = res;
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TMDB_INFO_FAILD')
        });
      });
    };

    /**
     * downloadTorrent
     * @param id
     */
    vm.downloadTorrent = function (id) {
      var url = '/api/torrents/download/' + id;
      DownloadService.downloadTorrentFile(url, null, function (status) {
        if (status === 200) {
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENTS_DOWNLOAD_SUCCESSFULLY')
          });
        }
      }, function (err) {
        //Notification.error({
        //  message: 'ERROR',
        //  title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_DOWNLOAD_ERROR')
        //});
      });
    };

    /**
     * getTagTitle
     * @param tag: tag name
     * @returns {*}
     */
    vm.getTagTitle = function (tag) {
      var tmp = tag;
      var find = false;
      angular.forEach(vm.resourcesTags.movie.radio, function (item) {
        angular.forEach(item.value, function (sitem) {
          if (sitem.name === tag) {
            tmp = item.name;
            find = true;
          }
        });
      });

      if (!find) {
        angular.forEach(vm.resourcesTags.movie.checkbox, function (item) {
          angular.forEach(item.value, function (sitem) {
            if (sitem.name === tag) {
              tmp = item.name;
            }
          });
        });
      }
      return tmp;
    };

    /**
     * getDirector
     * @returns {string}
     */
    vm.getDirector = function () {
      var n = '-';

      if (vm.movieinfo) {
        angular.forEach(vm.movieinfo.credits.crew, function (item) {
          if (item.job === 'Director') {
            n = item.name;
          }
        });
      }
      return n;
    };

    /**
     * getVideoNfoHtml
     * @returns {*}
     */
    vm.getVideoNfoHtml = function () {
      if (vm.torrentLocalInfo.torrent_nfo) {
        var info = $filter('videoNfo')(vm.torrentLocalInfo.torrent_nfo);
        return $sce.trustAsHtml(info);
      }
    };

    /**
     *
     */
    vm.submitComment = function () {

    };
  }
}());
