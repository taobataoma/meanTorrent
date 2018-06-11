(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsUploadController', TorrentsUploadController);

  TorrentsUploadController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'MeanTorrentConfig', 'Upload', 'Notification',
    'TorrentsService', 'getStorageLangService', '$filter', 'DownloadService', 'DebugConsoleService', 'NotifycationService', 'SideOverlay',
    '$templateRequest', 'marked', '$rootScope', 'localStorageService'];

  function TorrentsUploadController($scope, $state, $translate, $timeout, Authentication, MeanTorrentConfig, Upload, Notification,
                                    TorrentsService, getStorageLangService, $filter, DownloadService, mtDebug, NotifycationService, SideOverlay,
                                    $templateRequest, marked, $rootScope, localStorageService) {
    var vm = this;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.imdbConfig = MeanTorrentConfig.meanTorrentConfig.imdbConfig;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.supportConfig = MeanTorrentConfig.meanTorrentConfig.support;
    vm.scoreConfig = MeanTorrentConfig.meanTorrentConfig.score;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.torrentType = MeanTorrentConfig.meanTorrentConfig.torrentType;
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;
    vm.rssConfig = MeanTorrentConfig.meanTorrentConfig.rss;
    vm.ircConfig = MeanTorrentConfig.meanTorrentConfig.ircAnnounce;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.inviteConfig = MeanTorrentConfig.meanTorrentConfig.invite;
    vm.requestsConfig = MeanTorrentConfig.meanTorrentConfig.requests;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.salesTypeConfig = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
    vm.salesGlobalConfig = MeanTorrentConfig.meanTorrentConfig.torrentGlobalSales;
    vm.ircAnnounceConfig = MeanTorrentConfig.meanTorrentConfig.ircAnnounce;
    vm.passwordConfig = MeanTorrentConfig.meanTorrentConfig.password;
    vm.examinationConfig = MeanTorrentConfig.meanTorrentConfig.examination;
    vm.chatConfig = MeanTorrentConfig.meanTorrentConfig.chat;
    vm.accessConfig = MeanTorrentConfig.meanTorrentConfig.access;

    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.torrentType = MeanTorrentConfig.meanTorrentConfig.torrentType;
    vm.lang = getStorageLangService.getLang();
    vm.user = Authentication.user;
    vm.progress = 0;
    vm.torrentInfo = null;
    vm.tags = [];
    vm.maker = 'NULL';
    vm.anonymous = false;
    vm.isVipProperty = false;
    vm.videoNfo = '';
    vm.customTorrent = {};
    vm.resourceImagesList = [];

    $rootScope.uploadPopupNotShowNextTime = localStorageService.get('upload_popup_not_show_next_time');
    $rootScope.announceConfig = vm.announceConfig;
    /**
     * document.ready
     * #uploaded_popup.popup
     */
    $(document).ready(function () {
      $('#uploaded_popup').popup({
        outline: false,
        focusdelay: 400,
        vertical: 'top',
        autoopen: false,
        opacity: 0.6,
        blur: false,
        escape: false,
        closetransitionend: function () {
          if ($scope.uploadPopupNotShowNextTime) {
            localStorageService.set('upload_popup_not_show_next_time', true);
          }

          if (vm.downloadingTorrent) {
            vm.downloadTorrent(vm.downloadingTorrent._id);
          }
          $state.reload('torrents.uploads');
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
      });

      if ($scope.uploadPopupNotShowNextTime) {
        $('#uploaded_popup_wrapper').remove();
        $('#uploaded_popup_background').remove();
      }
    });

    /**
     * getAccessUploader
     * @returns {boolean}
     */
    vm.getAccessUploader = function () {
      if (!vm.accessConfig.upload.limitToMakerGroup) {
        return true;
      } else {
        return vm.user.makers.length > 0;
      }
    };

    /**
     * getTemplateFileContent
     * @param file
     */
    vm.getTemplateFileContent = function (file) {
      $templateRequest(file, true).then(function (response) {
        vm.templateFileContent = response;
      });
    };

    /**
     * getTemplateMarkedContent
     * @returns {*}
     */
    vm.getTemplateMarkedContent = function () {
      var tmp = $filter('fmt')(vm.templateFileContent, {
        appConfig: vm.appConfig,
        supportConfig: vm.supportConfig,
        announceConfig: vm.announceConfig,
        scoreConfig: vm.scoreConfig,
        rssConfig: vm.rssConfig,
        ircConfig: vm.ircConfig,
        signConfig: vm.signConfig,
        inviteConfig: vm.inviteConfig,
        requestsConfig: vm.requestsConfig,
        hnrConfig: vm.hnrConfig,
        tmdbConfig: vm.tmdbConfig,
        salesTypeConfig: vm.salesTypeConfig,
        salesGlobalConfig: vm.salesGlobalConfig,
        ircAnnounceConfig: vm.ircAnnounceConfig,
        passwordConfig: vm.passwordConfig,
        examinationConfig: vm.examinationConfig,
        chatConfig: vm.chatConfig,
        accessConfig: vm.accessConfig,

        user: vm.user
      });

      tmp = $filter('translate')(tmp);

      return marked(tmp, {sanitize: false});
    };

    /**
     * upload
     * @param dataUrl
     */
    vm.upload = function (dataUrl) {
      mtDebug.info(dataUrl);

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
        mtDebug.info(response);
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
      mtDebug.info(response);
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
      if (response.data.params) {
        response.data.message = $translate.instant(response.data.message, response.data.params);
      }
      mtDebug.info(response.data.message);

      NotifycationService.showErrorNotify(response.data.message, 'TORRENTS_UPLOAD_FAILED');
    }

    /**
     * uploadCustomTorrentCover
     * @param dataUrl
     */
    vm.uploadCustomTorrentCover = function (dataUrl) {
      mtDebug.info(dataUrl);

      if (dataUrl === null || dataUrl === undefined) {
        vm.customTorrent.fileSelected = false;
        Notification.info({
          message: '<i class="glyphicon glyphicon-info-sign"></i> ' + $translate.instant('TORRENTS_NO_FILE_SELECTED')
        });
        return;
      }

      Upload.upload({
        url: '/api/torrents/uploadTorrentCover',
        data: {
          newTorrentCoverFile: dataUrl
        }
      }).then(function (response) {
        vm.customTorrent.fileSelected = false;
        vm.customTorrent.successfully = true;
        mtDebug.info(response);
        vm.customTorrent.coverFileName = response.data.filename;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('COVER_UPLOAD_SUCCESSFULLY')
        });
      }, function (response) {
        mtDebug.info(response);
        if (response.status > 0) {
          vm.customTorrent.fileSelected = false;
          vm.customTorrent.successfully = false;
          vm.customTorrent.coverFile = undefined;
          Notification.error({
            message: response.data,
            title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('COVER_UPLOAD_FAILED')
          });
        }
      }, function (evt) {
        vm.customTorrent.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    /**
     * uploadTorrentImage
     * @param editor
     * @param ufile
     * @param progressback
     * @param callback
     * @param errback
     */
    vm.uploadTorrentImage = function (editor, ufile, progressback, callback, errback) {
      Upload.upload({
        url: '/api/torrents/uploadTorrentImage',
        data: {
          newTorrentImageFile: ufile
        }
      }).then(function (res) {
        if (callback) {
          callback(res.data.filename);
        }
      }, function (res) {
        if (errback && res.status > 0) {
          errback(res);
        }
      }, function (evt) {
        if (progressback) {
          progressback(parseInt(100.0 * evt.loaded / evt.total, 10));
        }
      });
    };

    /**
     * uploadTorrentScreenshotsImage
     * @param ufile
     * @param progressback
     * @param callback
     * @param errback
     */
    vm.uploadTorrentScreenshotsImage = function (ufile, progressback, callback, errback) {
      Upload.upload({
        url: '/api/torrents/uploadTorrentImage',
        data: {
          newTorrentImageFile: ufile
        }
      }).then(function (res) {
        if (callback) {
          callback(res.data.filename);
        }
      }, function (res) {
        if (errback && res.status > 0) {
          errback(res);
        }
      }, function (evt) {
        if (progressback) {
          progressback(parseInt(100.0 * evt.loaded / evt.total, 10));
        }
      });
    };

    /**
     * onTMDBIDKeyDown
     * @param evt
     */
    vm.onTMDBIDKeyDown = function (evt) {
      if (evt.keyCode === 13) {
        $timeout(function () {
          angular.element('#btnGetTMDBInfo').triggerHandler('click');
        }, 0);
      }
    };

    /**
     * onSearchKeyDown
     * @param evt
     */
    vm.onSearchKeyDown = function (evt) {
      if (evt.keyCode === 13) {
        $timeout(function () {
          angular.element('#btnSearchFromTMDB').triggerHandler('click');
        }, 0);
      }
    };

    /**
     * onPopupSearchOpen
     */
    vm.onPopupSearchOpen = function () {
      $('#skey').focus();
    };

    /**
     * onTextClick
     * @param $event
     */
    vm.onTextClick = function ($event) {
      $event.target.select();
    };

    /**
     * onTorrentTypeChanged
     */
    vm.onTorrentTypeChanged = function () {
      vm.tmdb_isloading = false;
      vm.tmdb_info_ok = undefined;

      vm.inputedEpisodesError = undefined;
      vm.inputedEpisodesOK = false;
      vm.showResourceTitleInput = false;
      vm.showResourceScreenShots = false;
      vm.showResourcesTag = false;

      vm.movieinfo = undefined;
      vm.tvinfo = undefined;
      vm.tmdb_id = undefined;

      vm.tags = [];
      vm.videoNfo = '';
      vm.customTorrent = {};

      vm.showVideoNfo = false;
      vm.showAgreeAndSubmit = false;

      $rootScope.clearResourceImages();
    };

    /**
     * getFormattedResourceTitle
     * @param title
     * @returns {*}
     */
    function getFormattedResourceTitle(title) {
      if (title) {
        //replace other pt site prefix
        title = title.replace(/\{([a-zA-Z0-9\_\-\.\s]){2,10}\}[\.|\s]*/gi, '');
        title = title.replace(/.torrent/g, '');
        title = title.replace(/[\.|\s]*mp4$/i, '');
        title = title.replace(/[\.|\s]*mkv$/i, '');

        // var re = /((?:^|\D)\d\.\d(?=\D|$))|\./g;
        var re = /[0-9]\.[0-9]\b|(\.)/g;
        var repl = title.replace(re, function ($0, $1) {
          // return ($1 ? $1.replace(/^\./, ' ') : ' ');
          return $1 === '.' ? ' ' : $0;
        });

        return repl;
      } else {
        return '';
      }
    }

    /**
     * isSelectedVipType
     * @param type
     * @returns {boolean}
     */
    function isSelectedVipType(type) {
      var v = false;
      angular.forEach(vm.torrentType.value, function (t) {
        if (t.value === type) {
          if (t.role === 'vip') {
            v = true;
          }
        }
      });

      return v;
    }

    /**
     * selectedTypeRole
     * @param type
     * @returns {string}
     */
    vm.selectedTypeRole = function (type) {
      var v = 'user';
      angular.forEach(vm.torrentType.value, function (t) {
        if (t.value === type) {
          v = t.role;
        }
      });

      return v;
    };

    /**
     * getIncludeUploadTemplateID
     * @param st
     */
    vm.getIncludeUploadTemplateID = function (st) {
      var inc = 'default';
      angular.forEach(vm.torrentType.value, function (tc) {
        if (tc.value === st) {
          inc = tc.uploadTemplateID;
        }
      });

      return inc;
    };

    /**
     * tagsFilter
     * @param item
     * @returns {boolean}
     */
    vm.tagsFilter = function (item) {
      var res = false;

      if (item.cats.includes(vm.selectedType)) {
        res = true;
      }

      return res;
    };

    /**
     * getTagsFilterCount
     * @returns {int}
     */
    vm.getTagsFilterCount = function () {
      var res = 0;

      angular.forEach(vm.resourcesTags.radio, function (t) {
        if (t.cats.includes(vm.selectedType))
          res++;
      });
      angular.forEach(vm.resourcesTags.checkbox, function (t) {
        if (t.cats.includes(vm.selectedType))
          res++;
      });

      return res;
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
      vm.tmdb_info_ok = undefined;
      TorrentsService.getTMDBMovieInfo({
        tmdbid: tmdbid,
        language: getStorageLangService.getLang()
      }, function (res) {
        vm.customTorrent.title = getFormattedResourceTitle(vm.torrentInfo.filename);
        vm.customTorrent.subtitle = res.title;

        vm.tmdb_info_ok = true;
        vm.tmdb_isloading = false;
        vm.showResourceTitleInput = true;
        vm.showResourceScreenShots = true;
        vm.showResourcesTag = true;
        vm.showVideoNfo = true;
        vm.showAgreeAndSubmit = true;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TMDB_ID_OK')
        });

        mtDebug.info(res);
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
      vm.tmdb_info_ok = undefined;
      TorrentsService.getTMDBTVInfo({
        tmdbid: tmdbid,
        language: getStorageLangService.getLang()
      }, function (res) {
        vm.customTorrent.title = getFormattedResourceTitle(vm.torrentInfo.filename);
        vm.customTorrent.subtitle = res.name;

        vm.tmdb_info_ok = true;
        vm.tmdb_isloading = false;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TMDB_ID_OK')
        });

        mtDebug.info(res);
        vm.tvinfo = res;
        if (parseInt(vm.tvinfo.number_of_seasons, 10) > 0) {
          vm.selectedSeasons = '1';
        }
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
     * tvContinue
     * @param isValid
     * @returns {boolean}
     */
    vm.tvContinue = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.episodesForm');

        vm.inputedEpisodesError = true;
        return false;
      } else {
        vm.inputedEpisodesError = false;
        vm.inputedEpisodesOK = true;
        vm.showResourceScreenShots = true;
        vm.showResourcesTag = true;
        vm.showResourceTitleInput = true;
        vm.showVideoNfo = true;
        vm.showAgreeAndSubmit = true;
      }
    };

    /**
     * create
     */
    vm.create = function () {
      mtDebug.info(vm.torrentInfo);

      switch (vm.selectedType) {
        case 'movie':
          vm.createMovieTorrent();
          break;
        case 'tvserial':
          vm.createTVTorrent();
          break;
        default:
          vm.createCustomTorrentTorrent();
      }
    };

    /**
     * createMovieTorrent
     */
    vm.createMovieTorrent = function () {
      vm.isCreating = true;

      var l = vm.getTorrentSize();
      var t = vm.getResourceTag();

      vm.movieinfo.custom_title = vm.customTorrent.title;
      vm.movieinfo.custom_subtitle = vm.customTorrent.subtitle;

      var torrent = new TorrentsService({
        info_hash: vm.torrentInfo.info_hash,
        maker: vm.maker === 'NULL' ? undefined : vm.maker,
        torrent_filename: vm.torrentInfo.filename,
        torrent_type: 'movie',
        torrent_vip: isSelectedVipType(vm.selectedType) || vm.isVipProperty,
        torrent_tags: t,
        torrent_nfo: vm.videoNfo,
        torrent_announce: vm.torrentInfo.announce,
        torrent_size: l,
        isAnonymous: vm.anonymous,
        reqId: $state.params.reqId || undefined,

        resource_detail_info: vm.movieinfo,
        screenshots_image: vm.resourceImagesList
      });

      torrent.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        mtDebug.info(res);
        vm.isCreating = false;
        vm.showUploadedPopup(res);
      }

      function errorCallback(res) {
        vm.isCreating = false;
        vm.error_msg = res.data.message;
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Torrent created error!'});
      }
    };

    /**
     * createTvTorrent
     */
    vm.createTVTorrent = function () {
      vm.isCreating = true;

      var l = vm.getTorrentSize();
      var t = vm.getResourceTag();

      vm.tvinfo.custom_title = vm.customTorrent.title;
      vm.tvinfo.custom_subtitle = vm.customTorrent.subtitle;

      var torrent = new TorrentsService({
        info_hash: vm.torrentInfo.info_hash,
        maker: vm.maker === 'NULL' ? undefined : vm.maker,
        torrent_filename: vm.torrentInfo.filename,
        torrent_type: 'tvserial',
        torrent_vip: isSelectedVipType(vm.selectedType) || vm.isVipProperty,
        torrent_seasons: vm.selectedSeasons,
        torrent_episodes: vm.inputedEpisodes,
        torrent_tags: t,
        torrent_nfo: vm.videoNfo,
        torrent_announce: vm.torrentInfo.announce,
        torrent_size: l,
        isAnonymous: vm.anonymous,
        reqId: $state.params.reqId || undefined,

        resource_detail_info: vm.tvinfo,
        screenshots_image: vm.resourceImagesList
      });

      torrent.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        mtDebug.info(res);
        vm.isCreating = false;
        vm.showUploadedPopup(res);
      }

      function errorCallback(res) {
        vm.isCreating = false;
        vm.error_msg = res.data.message;
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Torrent created error!'});
      }
    };

    /**
     * createCustomTorrentTorrent
     */
    vm.createCustomTorrentTorrent = function () {
      vm.isCreating = true;

      var l = vm.getTorrentSize();
      var t = vm.getResourceTag();

      var detail_info = {
        artist: vm.customTorrent.artist || undefined,
        title: vm.customTorrent.title,
        subtitle: vm.customTorrent.subtitle,
        custom_title: vm.customTorrent.title,
        custom_subtitle: vm.customTorrent.subtitle,
        cover: vm.customTorrent.coverFileName,
        overview: vm.customTorrent.detail,

        vote_average: 0,
        vote_total: 0,
        vote_count: 0,
        cover_crop: false
      };

      mtDebug.info($scope.uImages);
      var uimg = [];
      angular.forEach($scope.uImages, function (f) {
        mtDebug.info(f);
        uimg.push(f.name);
      });

      var torrent = new TorrentsService({
        info_hash: vm.torrentInfo.info_hash,
        maker: vm.maker === 'NULL' ? undefined : vm.maker,
        torrent_filename: vm.torrentInfo.filename,
        torrent_type: vm.selectedType,
        torrent_vip: isSelectedVipType(vm.selectedType) || vm.isVipProperty,
        torrent_tags: t,
        torrent_nfo: vm.videoNfo,
        torrent_announce: vm.torrentInfo.announce,
        torrent_size: l,
        isAnonymous: vm.anonymous,
        reqId: $state.params.reqId || undefined,

        resource_detail_info: detail_info,
        screenshots_image: vm.resourceImagesList,
        _uImage: uimg
      });

      mtDebug.info(torrent);

      torrent.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.isCreating = false;
        vm.showUploadedPopup(res);
      }

      function errorCallback(res) {
        vm.isCreating = false;
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

      angular.forEach(vm.resourcesTags.radio, function (item) {
        if (vm.tags['tag_' + item.name]) {
          t.push(vm.tags['tag_' + item.name]);
        }
      });
      angular.forEach(vm.resourcesTags.checkbox, function (item) {
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

    /**
     * showUploadedPopup
     * @param t
     */
    vm.showUploadedPopup = function (t) {
      vm.downloadingTorrent = t;
      $rootScope.downloadingTorrent = t;

      $rootScope.uploadPopupNotShowNextTime = localStorageService.get('upload_popup_not_show_next_time');
      if (!$rootScope.uploadPopupNotShowNextTime) {
        $timeout(function () {
          $('#uploaded_popup').popup('show');
        }, 10);
      } else {
        vm.downloadTorrent(vm.downloadingTorrent._id);
        $state.reload('torrents.uploads');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
    };

    /**
     * downloadTorrent
     * @param id
     */
    vm.downloadTorrent = function (id) {
      var url = '/api/torrents/download/' + id;
      DownloadService.downloadFile(url, null);
    };

    /**
     * needShowNFO
     * @param t
     */
    vm.needShowNFO = function (t) {
      var sh = false;
      switch (t) {
        case 'movie':
        case 'tvserial':
        case 'music':
        case 'sports':
        case 'variety':
        case 'adult':
          sh = true;
          break;
        default:
          sh = false;
      }

      return sh;
    };

    /**
     * beginSearchFromTMDB
     * @param evt
     */
    vm.beginSearchFromTMDB = function (evt) {
      vm.search = {};
      SideOverlay.open(evt, 'searchFromTMDBSlide');
    };

    /**
     * hideSearchPopup
     */
    vm.hideSearchPopup = function () {
      SideOverlay.close(null, 'searchFromTMDBSlide');
    };

    /**
     * searchFromTMDB
     */
    vm.searchFromTMDB = function () {
      vm.search.status_msg = 'LOAD_SEARCH_RESULT';
      vm.search.status = 'loading';
      vm.search.searchItems = undefined;

      mtDebug.info(vm.search.keys);

      TorrentsService.searchMovie({
        language: getStorageLangService.getLang(),
        query: vm.search.keys,
        type: vm.selectedType
      }, function (res) {
        mtDebug.info(res);

        vm.search.searchItems = res.results;
        vm.search.totalItems = res.total_results;
        vm.search.status = 'ok';
      }, function (err) {
        vm.search.status_msg = 'LOAD_SEARCH_RESULT_ERROR';
        vm.search.status = 'error';
      });
    };

    /**
     * onSelectResult
     */
    vm.onSelectResult = function () {
      vm.tmdb_id = parseInt(vm.search.sid, 10);
      SideOverlay.close(null, 'searchFromTMDBSlide');

      $timeout(function () {
        angular.element('#btnGetTMDBInfo').triggerHandler('click');
      }, 0);
    };
  }
}());
