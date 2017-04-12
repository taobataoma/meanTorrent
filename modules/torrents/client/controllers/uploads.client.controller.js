(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsUploadsController', TorrentsUploadsController);

  TorrentsUploadsController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'MeanTorrentConfig', 'Upload', 'Notification',
    'TorrentsService'];

  function TorrentsUploadsController($scope, $state, $translate, $timeout, Authentication, MeanTorrentConfig, Upload, Notification,
                                     TorrentsService) {
    var vm = this;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.imdbConfig = MeanTorrentConfig.meanTorrentConfig.imdbConfig;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.rule_items = [];
    vm.user = Authentication.user;
    vm.progress = 0;
    vm.successfully = undefined;
    vm.tmdb_info_ok = undefined;
    vm.torrentInfo = null;
    vm.tags = [];
    vm.videoNfo = '';

    for (var i = 0; i < $translate.instant('UPLOADS_RULES_COUNT'); i++) {
      vm.rule_items[i] = i;
    }

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
        // Show success message
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
     * getInfo
     * @param tmdbid
     */
    vm.getInfo = function (tmdbid) {
      console.log(tmdbid);
      if (tmdbid === null || tmdbid === undefined) {
        Notification.info({
          message: '<i class="glyphicon glyphicon-info-sign"></i> ' + $translate.instant('TMDB_ID_REQUIRED')
        });
        angular.element('#tmdbid').focus();
        return;
      }

      vm.tmdb_isloading = true;
      TorrentsService.getTMDBInfo({
        tmdbid: tmdbid,
        language: 'en'
      }, function (res) {
        vm.tmdb_info_ok = true;
        vm.tmdb_isloading = false;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TMDB_ID_OK')
        });

        console.log(res);
        vm.movieinfo = res;
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
      var d = new Date(vm.movieinfo.release_date);
      var l = 0;

      //console.log(vm.torrentInfo);

      angular.forEach(vm.torrentInfo.info.files, function (item) {
        l = l + item.length;
      });

      var t = [];
      angular.forEach(vm.resourcesTags.movie.radio, function (item) {
        if (vm.tags['tag_' + item.name]) {
          t.push(vm.tags['tag_' + item.name]);
        }
      });
      angular.forEach(vm.resourcesTags.movie.checkbox, function (item) {
        angular.forEach(item.value, function (sitem) {
          if (vm.tags['tag_' + item.name + '_' + sitem.name]) {
            t.push(sitem.name);
          }
        });
      });

      var g = [];
      angular.forEach(vm.movieinfo.genres, function (item) {
        g.push(item.name);
      });

      var torrent = new TorrentsService({
        info_hash: vm.torrentInfo.info_hash,
        torrent_filename: vm.torrentInfo.filename,
        torrent_tmdb_id: vm.tmdb_id,
        torrent_imdb_id: vm.movieinfo.imdb_id,
        torrent_title: vm.movieinfo.title,
        torrent_original_title: vm.movieinfo.original_title,
        torrent_type: 'movie',
        torrent_genres: g,
        torrent_tags: t,
        torrent_nfo: vm.videoNfo,
        torrent_announce: vm.torrentInfo.announce,
        torrent_imdb_votes: vm.movieinfo.vote_average,
        torrent_size: l,
        torrent_img: vm.movieinfo.poster_path,
        torrent_backdrop_img: vm.movieinfo.backdrop_path,
        torrent_release: d.getFullYear()
      });

      console.log(torrent);

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
