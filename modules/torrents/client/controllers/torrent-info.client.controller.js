(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsInfoController', TorrentsInfoController);

  TorrentsInfoController.$inject = ['$scope', '$state', '$stateParams', '$translate', 'Authentication', 'Notification', 'TorrentsService',
    'MeanTorrentConfig', 'DownloadService', '$sce', '$filter', 'CommentsService', 'ModalConfirmService', 'marked', 'Upload', '$timeout',
    'SubtitlesService', 'getStorageLangService', 'NotifycationService', 'DebugConsoleService', 'TorrentGetInfoServices',
    'localStorageService', '$compile', 'SideOverlay', 'ResourcesTagsServices', 'CollectionsService'];

  function TorrentsInfoController($scope, $state, $stateParams, $translate, Authentication, Notification, TorrentsService, MeanTorrentConfig,
                                  DownloadService, $sce, $filter, CommentsService, ModalConfirmService, marked, Upload, $timeout, SubtitlesService,
                                  getStorageLangService, NotifycationService, mtDebug, TorrentGetInfoServices,
                                  localStorageService, $compile, SideOverlay, ResourcesTagsServices, CollectionsService) {
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

    vm.torrentTabs = [];
    vm.searchTags = [];
    vm.progress = 0;

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
        vm.initTabLists();
        vm.commentBuildPager();
        vm.buildPeersPager();
      });
    };

    /**
     * reviewedTorrentStatus
     * @param item
     */
    vm.reviewedTorrentStatus = function () {
      vm.torrentLocalInfo.$setReviewedStatus(function (res) {
        mtDebug.info(res);
        vm.torrentLocalInfo = res;
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
      console.log(vm.torrentLocalInfo);
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
     * onPopupMessageOpen
     */
    vm.onPopupMessageOpen = function () {
      $('#coll-name').focus();
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

      //var sc = undefined;
      //angular.forEach(vm.collectionsItems, function (c) {
      //  if (c._id === vm.collectionTorrent.cid) {
      //    sc = c;
      //  }
      //});

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
          icon: 'fa-file-video-o',
          title: $translate.instant('TAB_TORRENT_INFO'),
          templateUrl: 'torrentInfo.html',
          ng_show: true,
          badges: []
        },
        {
          icon: 'fa-file-text',
          title: $translate.instant('TAB_USER_SUBTITLE'),
          templateUrl: 'subtitleInfo.html',
          ng_show: vm.torrentLocalInfo.torrent_type === 'movie' || vm.torrentLocalInfo.torrent_type === 'tvserial',
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
        {
          icon: 'fa-user-md',
          title: $translate.instant('TAB_MY_PANEL'),
          templateUrl: 'myPanel.html',
          ng_show: vm.torrentLocalInfo.isCurrentUserOwner,
          badges: []
        },
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
        console.log(res);
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
     * doUpdateTorrentInfo
     * @param minfo
     */
    vm.doUpdateTorrentInfo = function (resinfo) {
      resinfo.custom_title = vm.torrentLocalInfo.resource_detail_info.custom_title;
      resinfo.custom_subtitle = vm.torrentLocalInfo.resource_detail_info.custom_subtitle;

      vm.torrentLocalInfo.resource_detail_info = resinfo;

      vm.torrentLocalInfo.$update(function (response) {
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

      var src = angular.element(vm.previewImageEvent.imgs[vm.previewImageIndex]).attr('on-error-src');
      $('#popup_img_preview .img_item img').attr('src', src);
      $('#popup_img_preview .img_nav .img_page_info').html($translate.instant('IMG_PAGE_INFO', {
        index: vm.previewImageIndex + 1,
        total: vm.previewImageEvent.imgs.length
      }));
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
      var src = angular.element(vm.previewImageEvent.imgs[vm.previewImageIndex]).attr('on-error-src');
      $('#popup_img_preview .img_item img').attr('src', src);
      $('#popup_img_preview .img_nav .img_page_info').html($translate.instant('IMG_PAGE_INFO', {
        index: vm.previewImageIndex + 1,
        total: vm.previewImageEvent.imgs.length
      }));
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
      var src = angular.element(vm.previewImageEvent.imgs[vm.previewImageIndex]).attr('on-error-src');
      $('#popup_img_preview .img_item img').attr('src', src);
      $('#popup_img_preview .img_nav .img_page_info').html($translate.instant('IMG_PAGE_INFO', {
        index: vm.previewImageIndex + 1,
        total: vm.previewImageEvent.imgs.length
      }));
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
     * isOwner
     * @param o, topic or reply
     * @returns {boolean}
     */
    vm.isOwner = function (t) {
      if (t) {
        if (t.user._id.str === vm.user._id) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
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

  }
}());
