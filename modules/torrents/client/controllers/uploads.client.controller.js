(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsUploadController', TorrentsUploadController);

  TorrentsUploadController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'MeanTorrentConfig', 'Upload', 'Notification',
    'TorrentsService', 'getStorageLangService', '$filter'];

  function TorrentsUploadController($scope, $state, $translate, $timeout, Authentication, MeanTorrentConfig, Upload, Notification,
                                    TorrentsService, getStorageLangService, $filter) {
    var vm = this;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.imdbConfig = MeanTorrentConfig.meanTorrentConfig.imdbConfig;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.torrentType = MeanTorrentConfig.meanTorrentConfig.torrentType;
    vm.lang = getStorageLangService.getLang();
    vm.user = Authentication.user;
    vm.progress = 0;
    vm.selectedType = 'movie';
    vm.successfully = undefined;
    vm.tmdb_info_ok = undefined;
    vm.torrentInfo = null;
    vm.tags = [];
    vm.videoNfo = '';

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * upload
     * @param dataUrl
     */
    vm.upload = function (dataUrl) {
      //console.log(dataUrl);

      if (dataUrl === null || dataUrl === undefined) {
        vm.fileSelected = false;
        Notification.info({
          message: '<i class="glyphicon glyphicon-info-sign"></i> ' + $translate.instant('TORRENTS_NO_FILE_SELECTED')
        });
        return;
      }

      Upload.upload({
        url: '/api/torrents/upload',
        data: {
          newTorrentFile: dataUrl
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response);
        });
      }, function (response) {
        console.log(response);
        if (response.status > 0) onErrorItem(response);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    /**
     * onSuccessItem
     * @param response
     */
    function onSuccessItem(response) {
      vm.fileSelected = false;
      vm.successfully = true;
      // Show success message
      console.log(response);
      vm.torrentInfo = response.data;
      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENTS_UPLOAD_SUCCESSFULLY')
      });
    }

    /**
     * onErrorItem
     * @param response
     */
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.successfully = false;
      vm.tFile = undefined;
      // Show error message
      Notification.error({
        message: response.data,
        title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENTS_UPLOAD_FAILED')
      });
    }

    /**
     * onTMDBIDKeyDown
     * @param evt
     */
    vm.onTMDBIDKeyDown = function (evt) {
      if (evt.keyCode === 13) {
        vm.getInfo(vm.tmdb_id);
      }
    };

    /**
     * onTextClick
     * @param $event
     */
    vm.onTextClick = function ($event) {
      $event.target.select();
    };

    /**
     * getIncludeInfoTemplate
     * @returns {*}
     */
    vm.getIncludeInfoTemplate = function () {
      switch (vm.selectedType) {
        case 'tvseries':
          return 'tvinfo.html';
        case 'music':
          return 'musicinfo.html';
        case 'other':
          return 'otherinfo.html';
        default:
          return 'movieinfo.html';
      }
    };

    /**
     * onTorrentTypeChanged
     */
    vm.onTorrentTypeChanged = function () {
      vm.tmdb_info_ok = undefined;
      vm.tmdb_isloading = false;
      vm.movieinfo = undefined;
      vm.tvinfo = undefined;
      vm.tmdb_id = undefined;
    };

    /**
     * getInfo
     * @param tmdbid
     */
    vm.getInfo = function (tmdbid) {
      switch (vm.selectedType) {
        case 'tvseries':
          vm.getTVInfo(tmdbid);
          break;
        case 'music':
          break;
        case 'other':
          break;
        default:
          vm.getMovieInfo(tmdbid);
      }
    };

    /**
     * getMovieInfo
     * @param tmdbid
     */
    vm.getMovieInfo = function (tmdbid) {
      if (tmdbid === null || tmdbid === undefined) {
        Notification.info({
          message: '<i class="glyphicon glyphicon-info-sign"></i> ' + $translate.instant('TMDB_ID_REQUIRED')
        });
        angular.element('#tmdbid').focus();
        return;
      }

      vm.tmdb_isloading = true;
      TorrentsService.getTMDBMovieInfo({
        tmdbid: tmdbid,
        language: getStorageLangService.getLang()
      }, function (res) {
        vm.tmdb_info_ok = true;
        vm.tmdb_isloading = false;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TMDB_ID_OK')
        });

        console.log(res);
        vm.movieinfo = res;

        vm.movieinfo.release_date = $filter('date')(vm.movieinfo.release_date, 'yyyy');
      }, function (err) {
        vm.tmdb_info_ok = false;
        vm.tmdb_isloading = false;
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TMDB_ID_ERROR')
        });
        angular.element('#tmdbid').focus();
      });
    };

    /**
     * getTVInfo
     * @param tmdbid
     */
    vm.getTVInfo = function (tmdbid) {
      if (tmdbid === null || tmdbid === undefined) {
        Notification.info({
          message: '<i class="glyphicon glyphicon-info-sign"></i> ' + $translate.instant('TMDB_ID_REQUIRED')
        });
        angular.element('#tmdbid').focus();
        return;
      }

      vm.tmdb_isloading = true;
      TorrentsService.getTMDBTVInfo({
        tmdbid: tmdbid,
        language: getStorageLangService.getLang()
      }, function (res) {
        vm.tmdb_info_ok = true;
        vm.tmdb_isloading = false;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TMDB_ID_OK')
        });

        console.log(res);
        vm.tvinfo = res;
      }, function (err) {
        vm.tmdb_info_ok = false;
        vm.tmdb_isloading = false;
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TMDB_ID_ERROR')
        });
        angular.element('#tmdbid').focus();
      });
    };

    /**
     * create
     */
    vm.create = function () {
      //console.log(vm.torrentInfo);

      switch (vm.selectedType) {
        case 'tvseries':
          vm.createTVTorrent();
          break;
        case 'music':
          vm.createMusicTorrent();
          break;
        case 'other':
          vm.createOtherTorrent();
          break;
        default:
          vm.createMovieTorrent();
      }
    };

    /**
     * createMovieTorrent
     */
    vm.createMovieTorrent = function () {
      var l = vm.getTorrentSize();
      var t = vm.getResourceTag();

      var torrent = new TorrentsService({
        info_hash: vm.torrentInfo.info_hash,
        torrent_filename: vm.torrentInfo.filename,
        torrent_type: 'movie',
        torrent_tags: t,
        torrent_nfo: vm.videoNfo,
        torrent_announce: vm.torrentInfo.announce,
        torrent_size: l,

        resource_detail_info: vm.movieinfo
      });

      torrent.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        $state.reload('torrents.uploads');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Torrent created successfully!'});
      }

      function errorCallback(res) {
        vm.error_msg = res.data.message;
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Torrent created error!'});
      }
    };

    /**
     * createTvTorrent
     */
    vm.createTVTorrent = function () {
      var l = vm.getTorrentSize();
      var t = vm.getResourceTag();

      var torrent = new TorrentsService({
        info_hash: vm.torrentInfo.info_hash,
        torrent_filename: vm.torrentInfo.filename,
        torrent_type: 'tvseries',
        torrent_tags: t,
        torrent_nfo: vm.videoNfo,
        torrent_announce: vm.torrentInfo.announce,
        torrent_size: l,

        resource_detail_info: vm.tvinfo
      });

      torrent.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        $state.reload('torrents.uploads');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Torrent created successfully!'});
      }

      function errorCallback(res) {
        vm.error_msg = res.data.message;
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Torrent created error!'});
      }
    };

    /**
     * getTorrentSize
     * @returns {number}
     */
    vm.getTorrentSize = function () {
      var l = 0;

      if (vm.torrentInfo.length !== undefined) {
        l = vm.torrentInfo.length;
      } else if (vm.torrentInfo.info.length !== undefined) {
        l = vm.torrentInfo.info.length;
      } else {
        angular.forEach(vm.torrentInfo.info.files, function (item) {
          l = l + item.length;
        });
      }

      return l;
    };

    /**
     * getResourceTag
     * @returns {Array}
     */
    vm.getResourceTag = function () {
      var t = [];
      var r = undefined;

      switch (vm.selectedType) {
        case 'tvseries':
          r = vm.resourcesTags.tv;
          break;
        case 'music':
          r = vm.resourcesTags.music;
          break;
        case 'other':
          r = vm.resourcesTags.other;
          break;
        default:
          r = vm.resourcesTags.movie;
      }

      angular.forEach(r.radio, function (item) {
        if (vm.tags['tag_' + item.name]) {
          t.push(vm.tags['tag_' + item.name]);
        }
      });
      angular.forEach(r.checkbox, function (item) {
        angular.forEach(item.value, function (sitem) {
          if (vm.tags['tag_' + item.name + '_' + sitem.name]) {
            t.push(sitem.name);
          }
        });
      });

      return t;
    };

    /**
     * cancel
     */
    vm.cancel = function () {
      $state.reload('torrents.uploads');
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    };

    /**
     * clearAllCondition
     */
    vm.clearAllCondition = function () {
      vm.tags = [];
    };
  }
}());
