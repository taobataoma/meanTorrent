(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsInfoController', TorrentsInfoController);

  TorrentsInfoController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$translate', 'Authentication', 'Notification', 'TorrentsService',
    'MeanTorrentConfig', 'DownloadService', '$sce', '$filter', 'CommentsService', 'ModalConfirmService', 'marked', 'Upload', '$timeout',
    'SubtitlesService', 'getStorageLangService', 'NotifycationService', 'DebugConsoleService', 'TorrentGetInfoServices', 'AlbumsService',
    'localStorageService', '$compile', 'SideOverlay', 'ResourcesTagsServices', 'CollectionsService', 'moment'];

  function TorrentsInfoController($scope, $rootScope, $state, $stateParams, $translate, Authentication, Notification, TorrentsService, MeanTorrentConfig,
                                  DownloadService, $sce, $filter, CommentsService, ModalConfirmService, marked, Upload, $timeout, SubtitlesService,
                                  getStorageLangService, NotifycationService, mtDebug, TorrentGetInfoServices, AlbumsService,
                                  localStorageService, $compile, SideOverlay, ResourcesTagsServices, CollectionsService, moment) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = Authentication.user;
    vm.RTS = ResourcesTagsServices;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.supportConfig = MeanTorrentConfig.meanTorrentConfig.support;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.imdbConfig = MeanTorrentConfig.meanTorrentConfig.imdbConfig;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.torrentSalesType = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
    vm.torrentRLevels = MeanTorrentConfig.meanTorrentConfig.torrentRecommendLevel;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.scoreConfig = MeanTorrentConfig.meanTorrentConfig.score;
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;
    vm.salesGlobalConfig = MeanTorrentConfig.meanTorrentConfig.torrentGlobalSales;
    vm.mediaInfoConfig = MeanTorrentConfig.meanTorrentConfig.mediaInfo;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.torrentTypeConfig = MeanTorrentConfig.meanTorrentConfig.torrentType;

    vm.mediaInfoEditMode = false;

    vm.torrentTabs = [];
    vm.searchTags = [];
    vm.progress = 0;

    /**
     * window.resize()
     */
    $(window).resize(function () {
      if ($('#popup_img_preview_wrapper') && $('#popup_img_preview_wrapper').css('display') !== 'none') {
        vm.resizePopupImage();
      }
    });

    vm.resizePopupImage = function () {
      var img = $('#popup_img_preview .img_view .img_item img');
      var close = $('#popup_img_preview .img_view .img_item .popup_img_preview_close');

      $timeout(function () {
        // console.log('img.parent().height(): ' + img.parent().height() + ', img.outerHeight(): ' + img.outerHeight());
        var t = (img.parent().height() - img.outerHeight()) / 2;
        if (img.parent().height() !== img.outerHeight()) {
          img.css('margin-top', t + 'px');
          close.css('margin-top', t + 'px');
        } else {
          img.css('margin-top', 0);
          close.css('margin-top', 0);
        }
      }, 10);
    };

    /**
     * remove side_overlay background
     */
    $scope.$on('$stateChangeStart', function () {
      $('#popup_img_preview').popup('hide');
      $('#popup_img_preview_background').remove();
      $('#popup_img_preview_wrapper').remove();
    });

    /**
     * commentBuildPager
     * pagination init
     */
    vm.commentBuildPager = function () {
      vm.commentPagedItems = [];
      vm.commentItemsPerPage = vm.itemsPerPageConfig.torrentsCommentsPerPage;
      vm.commentCurrentPage = 1;
      vm.commentFigureOutItemsToDisplay();
    };

    /**
     * commentFigureOutItemsToDisplay
     * @param callback
     */
    vm.commentFigureOutItemsToDisplay = function (callback) {
      vm.commentFilterLength = vm.torrentLocalInfo._replies.length;
      var begin = ((vm.commentCurrentPage - 1) * vm.commentItemsPerPage);
      var end = begin + vm.commentItemsPerPage;
      vm.commentPagedItems = vm.torrentLocalInfo._replies.slice(begin, end);

      if (callback) callback();
    };

    /**
     * commentPageChanged
     * @param autoScroll, some time not scroll to top
     */
    vm.commentPageChanged = function (autoScroll) {
      var element = angular.element('#top_of_comments');

      $('#comment-list-div').fadeTo(100, 0.01, function () {
        vm.commentFigureOutItemsToDisplay(function () {
          $timeout(function () {
            $('#comment-list-div').fadeTo(400, 1, function () {
              if (autoScroll) {
                //window.scrollTo(0, element[0].offsetTop - 30);
                $('html,body').animate({scrollTop: element[0].offsetTop - 30}, 200);
              }
            });
          }, 100);
        });
      });
    };

    /**
     * $watch 'vm.torrentLocalInfo'
     */
    $scope.$watch('vm.torrentLocalInfo', function (newValue, oldValue) {
      if (vm.torrentLocalInfo) {
        vm.torrentLocalInfo.resource_detail_info.custom_title = vm.TGI.getTorrentCustomTitle(vm.torrentLocalInfo);
        vm.torrentLocalInfo.resource_detail_info.custom_subtitle = vm.TGI.getTorrentCustomSubTitle(vm.torrentLocalInfo);
      }

      if (vm.torrentLocalInfo && vm.torrentLocalInfo._replies) {
        var hasme = false;
        var meitem = null;

        if (newValue && oldValue) {
          if (newValue._replies.length > oldValue._replies.length) {
            angular.forEach(newValue._replies, function (n) {
              if (oldValue._replies.indexOf(n) < 0) {
                if (n.user._id.toString() === vm.user._id) {
                  hasme = true;
                  meitem = n;
                }
              }
            });
          }
        }

        if (hasme) {
          var totalPages = vm.commentItemsPerPage < 1 ? 1 : Math.ceil(newValue._replies.length / vm.commentItemsPerPage);
          var p = Math.max(totalPages || 0, 1);
          if (vm.commentCurrentPage !== p) {
            vm.commentCurrentPage = p;
            vm.commentPageChanged(false);
            vm.scrollToId = meitem._id;
          } else {
            vm.commentFigureOutItemsToDisplay();
          }
        } else {
          vm.commentFigureOutItemsToDisplay();
        }
      }
    });

    /**
     * getTorrentInfo
     */
    vm.getTorrentInfo = function () {
      TorrentsService.get({
        torrentId: $stateParams.torrentId
      }, function (res) {
        vm.torrentLocalInfo = res;
        mtDebug.info(vm.torrentLocalInfo);

        $('.backdrop').css('backgroundImage', 'url("' + vm.TGI.getTorrentBackdropImage(vm.torrentLocalInfo) + '")');

        vm.rating_vote = res.resource_detail_info.vote_average;

        vm.getTorrentCollectionsInfo($stateParams.torrentId);
        vm.getTorrentAlbumsInfo($stateParams.torrentId);

        vm.initTabLists();
        vm.commentBuildPager();
        vm.buildPeersPager();
      });
    };

    /**
     * getTorrentCollectionsInfo
     * @param tid
     */
    vm.getTorrentCollectionsInfo = function (tid) {
      CollectionsService.getTorrentCollections({
        torrentId: tid
      }, function (res) {
        console.log(res);
        vm.torrentCollectionsInfo = res;
      });
    };

    /**
     * getTorrentAlbumsInfo
     * @param tid
     */
    vm.getTorrentAlbumsInfo = function (tid) {
      AlbumsService.getTorrentAlbums({
        torrentId: tid
      }, function (res) {
        console.log(res);
        vm.torrentAlbumsInfo = res;
      });
    };

    /**
     * reviewedTorrentStatus
     * @param item
     */
    vm.reviewedTorrentStatus = function () {
      TorrentsService.setReviewedStatus({
        _torrentId: vm.torrentLocalInfo._id
      }, function (res) {
        vm.torrentLocalInfo = res;
        $rootScope.$broadcast('new-torrents-changed');
        NotifycationService.showSuccessNotify('TORRENT_SETREVIEWED_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'TORRENT_SETREVIEWED_ERROR');
      });
    };

    /**
     * toggleHnR
     */
    vm.toggleHnR = function () {
      vm.torrentLocalInfo.$toggleHnRStatus(function (res) {
        mtDebug.info(res);
        vm.torrentLocalInfo = res;
        NotifycationService.showSuccessNotify('TORRENT_TOGGLE_HNR_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'TORRENT_TOGGLE_HNR_FAILED');
      });
    };

    /**
     * toggleVIP
     */
    vm.toggleVIP = function () {
      vm.torrentLocalInfo.$toggleVIPStatus(function (res) {
        mtDebug.info(res);
        vm.torrentLocalInfo = res;
        NotifycationService.showSuccessNotify('TORRENT_TOGGLE_VIP_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'TORRENT_TOGGLE_VIP_FAILED');
      });
    };

    /**
     * toggleTop
     */
    vm.toggleTop = function (item) {
      vm.torrentLocalInfo.$toggleTopStatus(function (res) {
        mtDebug.info(res);
        vm.torrentLocalInfo = res;
        NotifycationService.showSuccessNotify('TORRENT_TOGGLE_TOP_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'TORRENT_TOGGLE_TOP_FAILED');
      });
    };

    /**
     * toggleUnique
     */
    vm.toggleUnique = function (item) {
      vm.torrentLocalInfo.$toggleUniqueStatus(function (res) {
        mtDebug.info(res);
        vm.torrentLocalInfo = res;
        NotifycationService.showSuccessNotify('TORRENT_TOGGLE_UNIQUE_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'TORRENT_TOGGLE_UNIQUE_FAILED');
      });
    };

    /**
     * editTags
     * @param evt
     */
    vm.editTags = function (evt) {
      vm.searchTags = vm.torrentLocalInfo.torrent_tags;
      SideOverlay.open(evt, 'tagsPopupSlide');
    };

    /**
     * hideTagsPopup
     */
    vm.hideTagsPopup = function () {
      SideOverlay.close(null, 'tagsPopupSlide');
    };

    /**
     * onOverviewKeyDown
     * @param e
     */
    vm.onOverviewKeyDown = function (e) {
      if (e.keyCode === 27) { // ESC
        var hasPopupMenu = false;
        var emojiMenu = $('.textcomplete-dropdown');
        angular.forEach(emojiMenu, function (e) {
          if (e.style.display === 'block') {
            hasPopupMenu = true;
          }
        });
        if (hasPopupMenu) {
          e.stopPropagation();
        }
      }
    };

    /**
     * onPopupCollectionsOpen
     */
    vm.onPopupCollectionsOpen = function () {
      $('#coll-name').focus();
    };

    /**
     * onPopupAlbumOpen
     */
    vm.onPopupAlbumOpen = function () {
      $('#album-name').focus();
    };

    /**
     * setTorrentTags
     */
    vm.setTorrentTags = function () {
      mtDebug.info(vm.searchTags);
      SideOverlay.close(null, 'tagsPopupSlide');

      TorrentsService.setTorrentTags({
        _torrentId: vm.torrentLocalInfo._id,
        tags: vm.searchTags
      }, function (res) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_SETTAGS_SUCCESSFULLY')
        });

        vm.torrentLocalInfo = res;
        mtDebug.info(res);
      }, function (res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_SETTAGS_ERROR')
        });
      });
    };

    /**
     * showCollectionCommand
     */
    vm.showCollectionCommand = function () {
      var cinfo = vm.torrentLocalInfo.resource_detail_info.belongs_to_collection;
      return cinfo === null ? false : true;
    };

    /**
     * createCollection
     * @param evt
     */
    vm.createCollection = function (evt) {
      vm.collection = {
        tmdb_id: vm.torrentLocalInfo.resource_detail_info.belongs_to_collection.id || 0,
        name: undefined,
        overview: undefined,
        poster_path: undefined,
        backdrop_path: undefined,

        status_msg: 'LOAD_TMDB_COLLECTION',
        status: 'loading'
      };

      SideOverlay.open(evt, 'collectionsCreateSlide');

      CollectionsService.getCollectionInfo({
        id: vm.collection.tmdb_id,
        language: getStorageLangService.getLang()
      }, function (res) {
        vm.collection.name = res.name;
        vm.collection.overview = res.overview;
        vm.collection.poster_path = res.poster_path;
        vm.collection.backdrop_path = res.backdrop_path;
        vm.collection.status = 'ok';

        mtDebug.info(vm.collection);
      }, function (err) {
        vm.collection.status = 'error';
        vm.collection.status_msg = 'LOAD_TMDB_COLLECTION_ERROR';
      });
    };

    /**
     * hideCollectionPopup
     */
    vm.hideCollectionPopup = function () {
      SideOverlay.close(null, 'collectionsCreateSlide');
      vm.collection = undefined;
    };

    /**
     * saveCollection
     */
    vm.saveCollection = function () {
      SideOverlay.close(null, 'collectionsCreateSlide');

      var coll = new CollectionsService(vm.collection);
      coll.$save(function (res) {
        NotifycationService.showSuccessNotify('COLLECTIONS.CREATE_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'COLLECTIONS.CREATE_FAILED');
      });

    };

    /**
     * insertIntoCollection
     * @param evt
     */
    vm.insertIntoCollection = function (evt) {
      vm.collectionsItems = undefined;

      vm.collectionTorrent = {
        tmdb_id: vm.torrentLocalInfo.resource_detail_info.belongs_to_collection.id || 0,
        id: vm.torrentLocalInfo._id,
        cid: undefined,
        title: vm.TGI.getTorrentTitle(vm.torrentLocalInfo),
        file: vm.torrentLocalInfo.torrent_filename,

        status_msg: 'LOAD_COLLECTION_LIST',
        status: 'loading'
      };

      SideOverlay.open(evt, 'collectionsInsertSlide');

      CollectionsService.get({
        tmdb_id: vm.collectionTorrent.tmdb_id
      }, function (res) {
        vm.collectionsItems = res.rows;
        vm.collectionTorrent.status = 'ok';

        mtDebug.info(res);
      }, function (err) {
        vm.collectionTorrent.status = 'error';
        vm.collectionTorrent.status_msg = 'LOAD_COLLECTION_LIST_ERROR';
      });
    };

    /**
     * hideCollectionInsertPopup
     */
    vm.hideCollectionInsertPopup = function () {
      SideOverlay.close(null, 'collectionsInsertSlide');
      vm.collectionsItems = undefined;
    };

    /**
     * saveInsertCollection
     */
    vm.saveInsertCollection = function () {
      SideOverlay.close(null, 'collectionsInsertSlide');

      CollectionsService.insertIntoCollection({
        collectionId: vm.collectionTorrent.cid,
        torrentId: vm.collectionTorrent.id
      }, function (res) {
        mtDebug.info(res);
        NotifycationService.showSuccessNotify('COLLECTIONS.INSERT_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'COLLECTIONS.INSERT_FAILED');
      });
    };

    /**
     * isAlreadyIn
     * @param c
     * @returns {boolean}
     */
    vm.isAlreadyIn = function (c) {
      var result = false;
      angular.forEach(c.torrents, function (t) {
        if (vm.torrentLocalInfo._id === t._id) {
          result = true;
        }
      });

      return result;
    };

    /**
     * createAlbum
     * @param evt
     */
    vm.createAlbum = function (evt) {
      vm.album = {
        type: vm.torrentLocalInfo.torrent_type,
        name: undefined,
        overview: undefined,
        backdrop_path: undefined
      };

      SideOverlay.open(evt, 'albumCreateSlide');
    };

    /**
     * hideAlbumPopup
     */
    vm.hideAlbumPopup = function () {
      SideOverlay.close(null, 'albumCreateSlide');
      vm.album = undefined;
    };

    /**
     * saveAlbum
     */
    vm.saveAlbum = function () {
      SideOverlay.close(null, 'albumCreateSlide');

      var album = new AlbumsService(vm.album);
      album.$save(function (res) {
        NotifycationService.showSuccessNotify('ALBUMS.CREATE_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'ALBUMS.CREATE_FAILED');
      });

    };

    /**
     * insertIntoCollection
     * @param evt
     */
    vm.insertIntoAlbum = function (evt) {
      vm.albumsItems = undefined;

      vm.albumTorrent = {
        type: vm.torrentLocalInfo.torrent_type,
        id: vm.torrentLocalInfo._id,
        aid: undefined,
        title: vm.TGI.getTorrentCustomTitle(vm.torrentLocalInfo),
        subtitle: vm.TGI.getTorrentCustomSubTitle(vm.torrentLocalInfo),

        status_msg: 'ALBUMS.LOAD_ALBUM_LIST',
        status: 'loading'
      };

      SideOverlay.open(evt, 'albumsInsertSlide');

      AlbumsService.query({
        type: vm.torrentLocalInfo.torrent_type
      }, function (res) {
        vm.albumsItems = res;
        vm.albumTorrent.status = 'ok';

        mtDebug.info(res);
        vm.figureOutAlbumsToDisplay();
      }, function (err) {
        vm.albumTorrent.status = 'error';
        vm.albumTorrent.status_msg = 'ALBUMS.LOAD_ALBUM_LIST_ERROR';
      });
    };

    /**
     * figureOutAlbumsToDisplay
     */
    vm.figureOutAlbumsToDisplay = function () {
      vm.filteredItems = $filter('filter')(vm.albumsItems, {
        'name': vm.filterKeyWord
      });
      vm.filteredItems = $filter('orderBy')(vm.filteredItems, ['-created_at']);
    };

    /**
     * hideAlbumInsertPopup
     */
    vm.hideAlbumInsertPopup = function () {
      SideOverlay.close(null, 'albumsInsertSlide');
      vm.albumsItems = undefined;
    };

    /**
     * saveInsertAlbum
     */
    vm.saveInsertAlbum = function () {
      SideOverlay.close(null, 'albumsInsertSlide');

      AlbumsService.insertIntoAlbum({
        albumId: vm.albumTorrent.aid,
        torrentId: vm.albumTorrent.id
      }, function (res) {
        mtDebug.info(res);
        NotifycationService.showSuccessNotify('ALBUMS.INSERT_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'ALBUMS.INSERT_FAILED');
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
    };

    /**
     * initTabLists
     */
    vm.initTabLists = function () {
      vm.torrentTabs = [];

      vm.torrentTabs.push(
        {
          icon: 'fa-file-video',
          title: $translate.instant('TAB_TORRENT_INFO'),
          templateUrl: 'torrentInfo.html',
          ng_show: true,
          badges: []
        },
        {
          icon: 'fa-file-alt',
          title: $translate.instant('TAB_USER_SCREENSHOTS'),
          templateUrl: 'screenshots.html',
          ng_show: vm.showScreenshotsTab(),
          badges: [
            {
              value: vm.torrentLocalInfo.screenshots_image.length,
              class: 'badge_info'
            }
          ]
        },
        {
          icon: 'fa-image',
          title: $translate.instant('TAB_USER_SUBTITLE'),
          templateUrl: 'subtitleInfo.html',
          ng_show: vm.showSubtitleTab(),
          badges: [
            {
              value: vm.torrentLocalInfo._subtitles.length,
              class: 'badge_info'
            }
          ]
        },
        {
          icon: 'fa-users',
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
          icon: 'fa-thumbs-up',
          title: $translate.instant('TAB_THUMBS_LIST'),
          templateUrl: 'thumbsInfo.html',
          ng_show: true,
          badges: [
            {
              value: vm.torrentLocalInfo._thumbs.length,
              class: 'badge_info'
            }
          ]
        },
        {
          icon: 'fa-list-alt',
          title: $translate.instant('TAB_OTHER_TORRENTS'),
          templateUrl: 'otherTorrents.html',
          ng_show: vm.torrentLocalInfo.resource_detail_info.id && vm.torrentLocalInfo._other_torrents.length > 0,
          badges: [
            {
              value: vm.torrentLocalInfo._other_torrents.length,
              class: 'badge_info'
            }
          ]
        },
        // {
        //   icon: 'fa-user-md',
        //   title: $translate.instant('TAB_MY_PANEL'),
        //   templateUrl: 'myPanel.html',
        //   ng_show: vm.torrentLocalInfo.isCurrentUserOwner,
        //   badges: []
        // },
        {
          icon: 'fa-cog',
          title: $translate.instant('TAB_ADMIN_PANEL'),
          templateUrl: 'adminPanel.html',
          ng_show: vm.user ? vm.user.isOper : false,
          badges: []
        }
      );
    };

    /**
     * showSubtitleTab
     * @returns {boolean}
     */
    vm.showSubtitleTab = function () {
      var s = false;
      if (vm.torrentLocalInfo) {
        angular.forEach(vm.torrentTypeConfig.value, function (t) {
          if (t.value === vm.torrentLocalInfo.torrent_type && t.showSubtitleTabInDetailPage) {
            s = true;
          }
        });
      }
      return s;
    };

    /**
     * showScreenshotsTab
     * @returns {boolean}
     */
    vm.showScreenshotsTab = function () {
      var s = false;
      if (vm.torrentLocalInfo) {
        angular.forEach(vm.torrentTypeConfig.value, function (t) {
          if (t.value === vm.torrentLocalInfo.torrent_type && t.showScreenshotsTabInDetailPage) {
            s = true;
          }
        });
      }
      return s;
    };

    /**
     * getResourceInfo
     */
    vm.getResourceInfo = function (tmdb_id) {
      if (vm.torrentLocalInfo.torrent_type === 'movie') {
        TorrentsService.getTMDBMovieInfo({
          tmdbid: tmdb_id,
          language: getStorageLangService.getLang()
        }, function (res) {
          res.release_date = $filter('date')(res.release_date, 'yyyy');
          vm.doUpdateTorrentInfo(res);
        }, function (err) {
          Notification.error({
            message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TMDB_INFO_FAILED')
          });
        });
      }
      if (vm.torrentLocalInfo.torrent_type === 'tvserial') {
        TorrentsService.getTMDBTVInfo({
          tmdbid: tmdb_id,
          language: getStorageLangService.getLang()
        }, function (res) {
          vm.doUpdateTorrentInfo(res);
        }, function (err) {
          Notification.error({
            message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TMDB_INFO_FAILED')
          });
        });
      }
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
     * submitComment
     */
    vm.submitComment = function () {
      if (vm.reply_action === 'edit') {
        vm.submitEditComment();
        return;
      }

      var comment = new CommentsService({
        _torrentId: vm.torrentLocalInfo._id,
        _commentId: vm.comment_to_id,
        comment: vm.new_comment_content
      });

      comment.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Comment created successfully!'
        });

        vm.scrollToId = vm.comment_to_id;
        vm.submitInit();
        vm.torrentLocalInfo = res;
      }

      function errorCallback(res) {
        vm.error_msg = res.data.message;
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Comment created error!'
        });
      }
    };

    /**
     * submitEditComment
     */
    vm.submitEditComment = function () {
      var comment = new CommentsService({
        _torrentId: vm.torrentLocalInfo._id,
        _commentId: vm.comment_to_id,
        _subCommentId: vm.comment_to_sub_id,
        comment: vm.new_comment_content
      });

      comment.$update(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Comment edited successfully!'
        });

        vm.scrollToId = vm.comment_to_id;
        vm.submitInit();
        vm.torrentLocalInfo = res;
      }

      function errorCallback(res) {
        vm.error_msg = res.data.message;
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Comment edited error!'
        });
      }
    };

    /**
     * submitInit
     */
    vm.submitInit = function () {
      vm.new_comment_content = '';
      vm.comment_to_id = undefined;
      vm.comment_to_sub_id = undefined;
      vm.comment_to_at = undefined;
      vm.reply_action = undefined;
    };

    /**
     * getCommentMarked
     * @param citem
     * @returns {*}
     */
    vm.getCommentMarked = function (citem) {
      return marked(citem.comment, {sanitize: true});
    };

    /**
     * getReplyMarked
     * @param sitem
     * @returns {*}
     */
    vm.getReplyMarked = function (sitem) {
      return marked(sitem.comment, {sanitize: true});
    };

    /**
     * replyComment
     * @param citem, comment item
     */
    vm.replyComment = function (citem) {
      vm.comment_to_id = citem._id;
      vm.comment_to_at = '@' + citem.user.displayName + ': ';
      vm.reply_action = 'reply';

      vm.new_comment_content = vm.comment_to_at;
      angular.element('#commentContent').trigger('focus');
    };

    /**
     * replySubComment
     * @param citem, comment item
     */
    vm.replySubComment = function (citem, sitem) {
      vm.comment_to_id = citem._id;
      vm.comment_to_at = '@' + sitem.user.displayName + ': ';
      vm.reply_action = 'reply';

      vm.new_comment_content = vm.comment_to_at;
      angular.element('#commentContent').trigger('focus');
    };

    /**
     * markLinkClick
     * @param evt
     * @param citem
     */
    vm.markLinkClick = function (evt, citem) {
      if (evt.originalEvent.srcElement.innerText[0] === '@') {
        evt.preventDefault();
        vm.comment_to_id = citem._id;
        vm.comment_to_at = evt.originalEvent.srcElement.innerText + ': ';
        vm.reply_action = 'reply';

        vm.new_comment_content = vm.comment_to_at;
        angular.element('#commentContent').trigger('focus');
      }
    };

    /**
     * editComment
     * @param citem
     */
    vm.editComment = function (citem) {
      vm.comment_to_id = citem._id;
      vm.reply_action = 'edit';

      vm.new_comment_content = citem.comment;
      angular.element('#commentContent').trigger('focus');
    };

    /**
     * editSubComment
     * @param citem
     * @param sitem
     */
    vm.editSubComment = function (citem, sitem) {
      vm.comment_to_id = citem._id;
      vm.comment_to_sub_id = sitem._id;
      vm.reply_action = 'edit';

      vm.new_comment_content = sitem.comment;
      angular.element('#commentContent').trigger('focus');
    };

    /**
     * deleteComment
     * @param citem
     */
    vm.deleteComment = function (citem) {
      var modalOptions = {
        closeButtonText: $translate.instant('COMMENT_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('COMMENT_CONFIRM_OK'),
        headerText: $translate.instant('COMMENT_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('COMMENT_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          var comment = new CommentsService({
            _torrentId: vm.torrentLocalInfo._id,
            _commentId: citem._id
          });

          comment.$remove(function (response) {
            successCallback(response);
          }, function (errorResponse) {
            errorCallback(errorResponse);
          });

          function successCallback(res) {
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> Comment deleted successfully!'
            });

            vm.submitInit();
            vm.scrollToId = undefined;
            vm.torrentLocalInfo = res;
          }

          function errorCallback(res) {
            vm.error_msg = res.data.message;
            Notification.error({
              message: res.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> Comment deleted error!'
            });
          }
        });
    };

    /**
     * deleteSubComment
     * @param citem
     */
    vm.deleteSubComment = function (citem, sitem) {
      var modalOptions = {
        closeButtonText: $translate.instant('COMMENT_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('COMMENT_CONFIRM_OK'),
        headerText: $translate.instant('COMMENT_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('COMMENT_CONFIRM_BODY_TEXT_REPLY')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          var comment = new CommentsService({
            _torrentId: vm.torrentLocalInfo._id,
            _commentId: citem._id,
            _subCommentId: sitem._id
          });

          comment.$remove(function (response) {
            successCallback(response);
          }, function (errorResponse) {
            errorCallback(errorResponse);
          });

          function successCallback(res) {
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> Comment reply deleted successfully!'
            });

            vm.submitInit();
            vm.scrollToId = undefined;
            vm.torrentLocalInfo = res;
          }

          function errorCallback(res) {
            vm.error_msg = res.data.message;
            Notification.error({
              message: res.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> Comment reply deleted error!'
            });
          }
        });
    };

    /**
     * upload
     * @param dataUrl
     */
    vm.upload = function (dataUrl) {
      mtDebug.info(dataUrl);

      if (dataUrl === null || dataUrl === undefined) {
        vm.fileSelected = false;
        return;
      }

      Upload.upload({
        url: '/api/subtitles/' + vm.torrentLocalInfo._id,
        data: {
          newSubtitleFile: dataUrl
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
    function onSuccessItem(res) {
      vm.fileSelected = false;
      vm.sFile = undefined;

      mtDebug.info(res);
      vm.torrentLocalInfo = res.data;
    }

    /**
     * onErrorItem
     * @param response
     */
    function onErrorItem(res) {
      vm.fileSelected = false;
      vm.sFile = undefined;
      // Show error message
      Notification.error({
        message: res.data.message,
        title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('SUBTITLE_UPLOAD_FAILED')
      });
    }

    /**
     * deleteSubtitle
     * @param sub
     */
    vm.deleteSubtitle = function (sub) {
      var modalOptions = {
        closeButtonText: $translate.instant('SUBTITLE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('SUBTITLE_CONFIRM_OK'),
        headerText: $translate.instant('SUBTITLE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('SUBTITLE_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          var subtitle = new SubtitlesService({
            _torrentId: vm.torrentLocalInfo._id,
            _subtitleId: sub._id
          });

          subtitle.$remove(function (response) {
            successCallback(response);
          }, function (errorResponse) {
            errorCallback(errorResponse);
          });

          function successCallback(res) {
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('SUBTITLE_DELETE_SUCCESSFULLY')
            });

            vm.torrentLocalInfo = res;
          }

          function errorCallback(res) {
            vm.error_msg = res.data.message;
            Notification.error({
              message: res.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('SUBTITLE_DELETE_ERROR')
            });
          }
        });
    };

    /**
     * deleteTorrent
     */
    vm.deleteTorrent = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('TORRENT_DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('TORRENT_DELETE_CONFIRM_OK'),
        headerText: $translate.instant('TORRENT_DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('TORRENT_DELETE_CONFIRM_BODY_TEXT'),
        bodyParams: vm.torrentLocalInfo.torrent_filename,

        selectOptions: {
          enable: true,
          title: 'TORRENT_DELETE_REASON',
          options: [
            'TORRENT_DELETE_REASON_OVERVIEW',
            'TORRENT_DELETE_REASON_NFO',
            'TORRENT_DELETE_REASON_QUALITY',
            'TORRENT_DELETE_REASON_ILLEGAL'
          ]
        }
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          var reason = result.reason;
          if (reason === 'CUSTOM') reason = result.custom;

          vm.torrentLocalInfo.$remove({
            reason: reason
          }, function (response) {
            successCallback(response);
          }, function (errorResponse) {
            errorCallback(errorResponse);
          });

          function successCallback(res) {
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_DELETE_SUCCESSFULLY')
            });

            $state.go($state.previous.state.name || 'torrents.movie');
          }

          function errorCallback(res) {
            vm.error_msg = res.data.message;
            Notification.error({
              message: res.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_DELETE_ERROR')
            });
          }
        });
    };

    /**
     * updateTorrent
     */
    vm.updateTorrent = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('TORRENT_UPDATE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('TORRENT_UPDATE_CONFIRM_OK'),
        headerText: $translate.instant('TORRENT_UPDATE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('TORRENT_UPDATE_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          vm.getResourceInfo(vm.torrentLocalInfo.resource_detail_info.id);
        });
    };

    /**
     * isOwner
     * @param o, topic or reply
     * @returns {boolean}
     */
    vm.isOwner = function (o) {
      if (o) {
        if (o.user._id === vm.user._id) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    /**
     * canEdit
     * @returns {boolean}
     */
    vm.canEdit = function () {
      if (vm.user.isOper) {
        return true;
      } else {
        return false;
      }
    };

    /**
     * onTorrentTitleEdited
     */
    $scope.onTorrentTitleEdited = function (modifyed) {
      if (vm.torrentLocalInfo && modifyed) {
        TorrentsService.update({
          _id: vm.torrentLocalInfo._id,
          custom_title: vm.torrentLocalInfo.resource_detail_info.custom_title
        }, function (res) {
          vm.torrentLocalInfo = res;
          NotifycationService.showSuccessNotify('TORRENT_UPDATE_SUCCESSFULLY');
        }, function (res) {
          NotifycationService.showErrorNotify(res.data.message, 'TORRENT_UPDATE_ERROR');
        });
      }
    };

    /**
     * onTorrentSubTitleEdited
     */
    $scope.onTorrentSubTitleEdited = function (modifyed) {
      if (vm.torrentLocalInfo && modifyed) {
        TorrentsService.update({
          _id: vm.torrentLocalInfo._id,
          custom_subtitle: vm.torrentLocalInfo.resource_detail_info.custom_subtitle
        }, function (res) {
          vm.torrentLocalInfo = res;
          NotifycationService.showSuccessNotify('TORRENT_UPDATE_SUCCESSFULLY');
        }, function (res) {
          NotifycationService.showErrorNotify(res.data.message, 'TORRENT_UPDATE_ERROR');
        });
      }
    };

    /**
     * doUpdateTorrentInfo
     * @param minfo
     */
    vm.doUpdateTorrentInfo = function (resinfo) {
      resinfo.custom_title = vm.torrentLocalInfo.resource_detail_info.custom_title;
      resinfo.custom_subtitle = vm.torrentLocalInfo.resource_detail_info.custom_subtitle;

      TorrentsService.update({
        _id: vm.torrentLocalInfo._id,
        resource_detail_info: resinfo
      }, function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.torrentLocalInfo = res;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_UPDATE_SUCCESSFULLY')
        });
      }

      function errorCallback(res) {
        vm.error_msg = res.data.message;
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_UPDATE_ERROR')
        });
      }
    };

    /**
     * setSaleType
     */
    vm.setSaleType = function () {
      if (vm.model_salestype) {
        TorrentsService.setSaleType({
          _torrentId: vm.torrentLocalInfo._id,
          _saleType: vm.model_salestype
        }, function (res) {
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_SETSALETYPE_SUCCESSFULLY')
          });

          mtDebug.info(res);
          vm.torrentLocalInfo = res;
        }, function (res) {
          Notification.error({
            message: res.data.message,
            title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_SETSALETYPE_ERROR')
          });
        });
      }
    };

    /**
     * setRecommendLevel
     */
    vm.setRecommendLevel = function () {
      if (vm.model_rlevel) {
        TorrentsService.setRecommendLevel({
          _torrentId: vm.torrentLocalInfo._id,
          _rlevel: vm.model_rlevel
        }, function (res) {
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_SETRLEVEL_SUCCESSFULLY')
          });

          vm.torrentLocalInfo = res;
        }, function (res) {
          Notification.error({
            message: res.data.message,
            title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_SETRLEVEL_ERROR')
          });
        });
      }
    };

    /**
     * beginThumbsUp
     * @param t, torrent
     */
    vm.beginThumbsUp = function (t) {
      t.$thumbsUp(function (res) {
        vm.torrentLocalInfo = res;
        vm.torrentTabs[3].badges[0].value += 1;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_THUMBS_SUCCESSFULLY')
        });
      }, function (res) {
        Notification.error({
          message: $translate.instant(res.data.message),
          title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_THUMBS_FAILED')
        });
      });
    };

    /**
     * getOverviewMarkedContent
     * @param t
     * @returns {*}
     */
    vm.getOverviewMarkedContent = function (c) {
      return marked(c, {sanitize: true});
    };

    /**
     * onImageClick
     * @param evt
     */
    vm.onImageClick = function (evt) {
      mtDebug.info(evt);
      vm.previewImageEvent = evt;
      vm.previewImageIndex = evt.index;
      $('#popup_img_preview').popup({
        transition: 'all 0.5s',
        autoopen: false,
        color: '#000',
        opacity: 0.7
      });

      initPupupImage();

      $('#popup_img_preview').popup('show');
    };

    /**
     * previousImage
     */
    vm.previousImage = function () {
      if (vm.previewImageIndex === 0) {
        vm.previewImageIndex = vm.previewImageEvent.imgs.length - 1;
      } else {
        vm.previewImageIndex -= 1;
      }

      initPupupImage();
    };

    /**
     * nextImage
     */
    vm.nextImage = function () {
      if (vm.previewImageIndex >= vm.previewImageEvent.imgs.length - 1) {
        vm.previewImageIndex = 0;
      } else {
        vm.previewImageIndex += 1;
      }

      initPupupImage();
    };

    function initPupupImage() {
      var src = angular.element(vm.previewImageEvent.imgs[vm.previewImageIndex]).attr('on-error-src');
      var esrc = angular.element(vm.previewImageEvent.imgs[vm.previewImageIndex]).attr('data-back-src');

      $('#popup_img_preview .img_view .mask-background').css('display', 'block');
      $('#popup_img_preview .img_view .mask-background').css('background-color', 'rgba(32, 32, 32, 0.6)');
      $('#popup_img_preview .img_view .tmdb-image-loading').css('display', 'block');

      $('#popup_img_preview .img_view .img_item img').attr('src', null);
      $('#popup_img_preview .img_view .img_item img').attr('on-error-src', esrc);
      $('#popup_img_preview .img_view .img_item img').attr('src', src);
      $('#popup_img_preview .img_view .img_item img').removeClass('img-thumbnail img-responsive');
      $('#popup_img_preview .img_view .img_item .popup_img_preview_close').css('display', 'none');

      $('#popup_img_preview .img_nav .img_page_info').html($translate.instant('IMG_PAGE_INFO', {
        index: vm.previewImageIndex + 1,
        total: vm.previewImageEvent.imgs.length
      }));
    }

    /**
     * onTmdbImageLoad
     */
    vm.onTmdbImageLoad = function () {
      $('#popup_img_preview .img_view .mask-background').css('background-color', 'rgba(32, 32, 32, 0)');
      $('#popup_img_preview .img_view .mask-background').css('display', 'none');
      $('#popup_img_preview .img_view .tmdb-image-loading').css('display', 'none');

      $('#popup_img_preview .img_view .img_item img').addClass('img-thumbnail img-responsive');
      $('#popup_img_preview .img_view .img_item .popup_img_preview_close').css('display', 'block');

      vm.resizePopupImage();
    };

    /**
     * ratingTorrent
     * @param item
     */
    vm.ratingTorrent = function (item) {
      item.$rating({
        vote: vm.rating_vote
      }, function (res) {
        vm.torrentLocalInfo = res;
        vm.rating_vote = res.resource_detail_info.vote_average;

        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_RATING_SUCCESSFULLY')
        });
      }, function (res) {
        vm.rating_vote = vm.torrentLocalInfo.resource_detail_info.vote_average;
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_RATING_FAILED')
        });
      });
    };

    /**
     * beginEditOverview
     * @param r
     */
    vm.beginEditOverview = function (r) {
      var el = $('#' + r._id);

      el.markdown({
        autofocus: true,
        savable: true,
        hideable: true,
        iconlibrary: 'fa',
        resize: 'vertical',
        language: localStorageService.get('storage_user_lang'),
        fullscreen: {enable: false},
        onSave: function (e) {
          if (e.isDirty()) {
            var resinfo = r.resource_detail_info;
            resinfo.overview = e.getContent();
            vm.doUpdateTorrentInfo(resinfo);

            e.$options.hideable = true;
            e.blur();
          } else {
            e.$options.hideable = true;
            e.blur();
          }
        },
        onChange: function (e) {
          e.$options.hideable = false;
        },
        onShow: function (e) {
          $('#' + e.$editor.attr('id') + ' .md-input').textcomplete([
            { // emoji strategy
              match: /\B:([\-+\w]*)$/,
              search: function (term, callback) {
                callback($.map(window.emojies, function (emoji) {
                  return emoji.indexOf(term) === 0 ? emoji : null;
                }));
              },
              template: function (value) {
                return '<img class="ac-emoji" src="/graphics/emojis/' + value + '.png" />' + '<span class="ac-emoji-text">' + value + '</span>';
              },
              replace: function (value) {
                return ':' + value + ': ';
              },
              index: 1
            }
          ]);

          var oe = angular.element('#top_of_overview');
          window.scrollTo(0, oe[0].offsetTop);

          e.setContent(r.resource_detail_info.overview);

          var elei = $('#' + e.$editor.attr('id') + ' .md-input');
          angular.element(elei).css('height', '550px');
          angular.element(elei).css('color', '#333');

          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
          angular.element(ele).addClass('text-right');
          angular.element(ele[0].childNodes[0]).addClass('btn-width-80');
          ele[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-default btn-width-80 margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
          cbtn.bind('click', function (evt) {
            e.setContent(r.resource_detail_info.overview);
            e.$options.hideable = true;
            e.blur();
          });
          ele.append(cbtn);
          $compile(e.$editor.contents())($scope);
        },
        onPreview: function (e) {
          $('#' + e.$editor.attr('id') + ' .md-footer').css('display', 'none');
        },
        onPreviewEnd: function (e) {
          $('#' + e.$editor.attr('id') + ' .md-footer').css('display', 'block');
        }
      });
    };

    /**
     * beginEditScreenshots
     */
    vm.beginEditScreenshots = function () {
      vm.isEditScreenshots = true;

      var imgDiv = angular.element('.torrent-images .torrent-img-list');
      if (imgDiv) {
        imgDiv.css('display', 'none');
      }
    };

    /**
     * CancelScreenshots
     */
    vm.CancelScreenshots = function () {
      vm.isEditScreenshots = false;

      var imgDiv = angular.element('.torrent-images .torrent-img-list');
      if (imgDiv) {
        imgDiv.css('display', 'inline-flex');
      }
    };

    /**
     * beginSaveScreenshots
     */
    vm.beginSaveScreenshots = function () {
      TorrentsService.update({
        _id: vm.torrentLocalInfo._id,
        screenshots_image: vm.torrentLocalInfo.screenshots_image
      }, function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.torrentLocalInfo = res;
        vm.isEditScreenshots = false;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_UPDATE_SUCCESSFULLY')
        });
      }

      function errorCallback(res) {
        vm.error_msg = res.data.message;
        vm.isEditScreenshots = false;
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_UPDATE_ERROR')
        });
      }

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
     * buildPeersPager
     */
    vm.buildPeersPager = function () {
      vm.seederPagedItems = [];
      vm.leecherPagedItems = [];

      vm.peerItemsPerPage = vm.itemsPerPageConfig.torrentPeersListPerPage;

      vm.currentSeederPage = 1;
      vm.currentLeecherPage = 1;

      vm.figureOutSeederItemsToDisplay();
      vm.figureOutLeecherItemsToDisplay();
    };

    /**
     * figureOutSeederItemsToDisplay
     * @param callback
     */
    vm.figureOutSeederItemsToDisplay = function (callback) {
      vm.getSeederUsers(vm.currentSeederPage, function (items) {
        vm.seederFilterLength = items.total;
        vm.seederPagedItems = items.rows;

        if (callback) callback();
      });
    };

    /**
     * figureOutLeecherItemsToDisplay
     * @param callback
     */
    vm.figureOutLeecherItemsToDisplay = function (callback) {
      vm.getLeecherUsers(vm.currentLeecherPage, function (items) {
        vm.leecherFilterLength = items.total;
        vm.leecherPagedItems = items.rows;

        if (callback) callback();
      });
    };

    /**
     * getSeederUsers
     * @param p
     * @param callback
     */
    vm.getSeederUsers = function (p, callback) {
      TorrentsService.getSeederUsers({
        torrentId: vm.torrentLocalInfo._id,
        skip: (p - 1) * vm.peerItemsPerPage,
        limit: vm.peerItemsPerPage
      }, function (data) {
        mtDebug.info(data);
        callback(data);
      });
    };

    /**
     * getLeecherUsers
     * @param p
     * @param callback
     */
    vm.getLeecherUsers = function (p, callback) {
      TorrentsService.getLeecherUsers({
        torrentId: vm.torrentLocalInfo._id,
        skip: (p - 1) * vm.peerItemsPerPage,
        limit: vm.peerItemsPerPage
      }, function (data) {
        mtDebug.info(data);
        callback(data);
      });
    };

    /**
     * seederPageChanged
     */
    vm.seederPageChanged = function () {
      var element = angular.element('#top_of_seeder_list');

      vm.figureOutSeederItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
        }, 10);
      });
    };

    /**
     * seederPageChanged
     */
    vm.leecherPageChanged = function () {
      var element = angular.element('#top_of_leecher_list');

      vm.figureOutLeecherItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
        }, 10);
      });
    };

    /**
     * isGlobalSaleNow
     * @returns {boolean}
     */
    vm.isGlobalSaleNow = function () {
      var start = moment(vm.salesGlobalConfig.global.startAt, vm.salesGlobalConfig.global.timeFormats).valueOf();
      var end = start + vm.salesGlobalConfig.global.expires;
      var now = Date.now();

      if (now > start && now < end && vm.salesGlobalConfig.global.value) {
        return true;
      } else {
        return false;
      }
    };

    /**
     * updateTorrentNfo
     */
    vm.updateTorrentNfo = function () {
      TorrentsService.update({
        _id: vm.torrentLocalInfo._id,
        torrent_nfo: vm.torrentLocalInfo.torrent_nfo
      }, function (res) {
        vm.torrentLocalInfo = res;
        NotifycationService.showSuccessNotify('EDIT_TORRENT_NFO_SUCCESSFULLY');
        vm.mediaInfoEditMode = false;
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'EDIT_TORRENT_NFO_FAILED');
      });
    };

    /**
     * CancelTorrentNfo
     * @constructor
     */
    vm.CancelTorrentNfo = function () {
      vm.mediaInfoEditMode = false;
    };

    /**
     * doEditMediaInfo
     */
    vm.doEditMediaInfo = function () {
      vm.mediaInfoEditMode = true;
    };
  }
}());
