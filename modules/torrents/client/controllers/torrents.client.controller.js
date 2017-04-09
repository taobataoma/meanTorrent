(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsController', TorrentsController);

  TorrentsController.$inject = ['$scope', '$state', '$stateParams', '$translate', '$timeout', 'Authentication', 'Notification', 'TorrentsService',
    'MeanTorrentConfig', 'DownloadService', '$window', '$sce', '$filter'];

  function TorrentsController($scope, $state, $stateParams, $translate, $timeout, Authentication, Notification, TorrentsService, MeanTorrentConfig,
                              DownloadService, $window, $sce, $filter) {
    var vm = this;
    vm.user = Authentication.user;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;

    vm.searchTags = [];
    vm.searchKey = '';
    vm.currPageNumber = 1;
    vm.topNumber = 6;
    vm.pageNumber = 50;
    vm.releaseYear = undefined;

    vm.torrentTabs = [
      {title: $translate.instant('TAB_VIDEO_INFO'), templateUrl: 'videoInfo.html'},
      {title: $translate.instant('TAB_USER_SUBTITLE'), templateUrl: 'subtitleInfo.html'},
      {title: $translate.instant('TAB_USER_INFO'), templateUrl: 'userInfo.html'},
      {title: $translate.instant('TAB_OTHER_TORRENTS'), templateUrl: 'otherTorrents.html'},
      {title: $translate.instant('TAB_MY_PANEL'), templateUrl: 'myPanel.html'},
      {title: $translate.instant('TAB_ADMIN_PANEL'), templateUrl: 'adminPanel.html'}
    ];

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * getMovieTopInfo
     */
    vm.getMovieTopInfo = function () {
      TorrentsService.query({
        limit: vm.topNumber
      }, function (items) {
        vm.movieTopInfo = items;
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TOP_MOVIE_INFO_ERROR')
        });
      });
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
      vm.getMoviePageInfo(1);
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
      vm.getMoviePageInfo(1);
    };

    /**
     * onKeysKeyDown
     * @param evt
     */
    vm.onKeysKeyDown = function (evt) {
      if (evt.keyCode === 13) {
        vm.getMoviePageInfo(1);
      }
    };

    /**
     * getMoviePageInfo
     * @param p: page number
     */
    vm.getMoviePageInfo = function (p) {
      vm.currPageNumber = p;

      //if searchKey or searchTags has value, the skip=0
      var skip = vm.topNumber;
      if (vm.searchKey.trim().length > 0 || vm.searchTags.length > 0) {
        skip = 0;
      }

      TorrentsService.query({
        skip: (p - 1) * vm.pageNumber + 0,
        limit: p * vm.pageNumber,
        keys: vm.searchKey,
        torrent_status: 'reviewed',
        torrent_type: 'movie',
        torrent_release: vm.releaseYear,
        torrent_tags: vm.searchTags
      }, function (items) {
        vm.moviePageInfo = items;
        if (items.length === 0) {
          Notification.error({
            message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('MOVIE_PAGE_INFO_EMPTY')
          });
        }
        console.log(items);
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('MOVIE_PAGE_INFO_ERROR')
        });
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
     * clearAllCondition
     */
    vm.clearAllCondition = function () {
      vm.searchKey = '';
      vm.searchTags = [];
      $('.btn-tag').removeClass('btn-success').addClass('btn-default');

      vm.getMoviePageInfo(1);
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
      vm.getMoviePageInfo(1);
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
     * openTorrentInfo
     * @param id
     */
    vm.openTorrentInfo = function (id) {
      var url = $state.href('torrents.view', {torrentId: id});
      $window.open(url, '_blank');
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
  }
}());
