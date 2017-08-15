(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsInfoController', TorrentsInfoController);

  TorrentsInfoController.$inject = ['$scope', '$state', '$stateParams', '$translate', 'Authentication', 'Notification', 'TorrentsService',
    'MeanTorrentConfig', 'DownloadService', '$sce', '$filter', 'CommentsService', 'ModalConfirmService', 'marked', 'Upload', '$timeout',
    'SubtitlesService', 'getStorageLangService'];

  function TorrentsInfoController($scope, $state, $stateParams, $translate, Authentication, Notification, TorrentsService, MeanTorrentConfig,
                                  DownloadService, $sce, $filter, CommentsService, ModalConfirmService, marked, Upload, $timeout, SubtitlesService,
                                  getStorageLangService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.imdbConfig = MeanTorrentConfig.meanTorrentConfig.imdbConfig;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.torrentSalesType = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
    vm.torrentRLevels = MeanTorrentConfig.meanTorrentConfig.torrentRecommendLevel;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.scoreConfig = MeanTorrentConfig.meanTorrentConfig.score;

    vm.torrentTabs = [];
    vm.progress = 0;

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * commentBuildPager
     * pagination init
     */
    vm.commentBuildPager = function () {
      vm.commentPagedItems = [];
      vm.commentItemsPerPage = vm.itemsPerPageConfig.torrents_comments_per_page;
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
      vm.torrentLocalInfo = TorrentsService.get({
        torrentId: $stateParams.torrentId
      }, function (res) {
        if (res.resource_detail_info.backdrop_path) {
          $('.backdrop').css('backgroundImage', 'url(' + vm.tmdbConfig.backdrop_img_base_url + res.resource_detail_info.backdrop_path + ')');
        }

        vm.initTabLists();
        vm.commentBuildPager();
      });

      console.log(vm.torrentLocalInfo);
    };

    /**
     * initTabLists
     */
    vm.initTabLists = function () {
      vm.torrentTabs = [];

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
          ng_show: vm.announce.private_torrent_cms,
          badges: [
            {
              value: '↑ ' + vm.torrentLocalInfo.torrent_seeds + '　↓ ' + vm.torrentLocalInfo.torrent_leechers + '　√ ' + vm.torrentLocalInfo.torrent_finished,
              class: 'badge_info'
            }
          ]
        },
        {
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
          title: $translate.instant('TAB_OTHER_TORRENTS'),
          templateUrl: 'otherTorrents.html',
          ng_show: vm.torrentLocalInfo._other_torrents.length > 0,
          badges: [
            {
              value: vm.torrentLocalInfo._other_torrents.length,
              class: 'badge_info'
            }
          ]
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
     * downloadTorrent
     * @param id
     */
    vm.downloadTorrent = function (id) {
      var url = '/api/torrents/download/' + id;
      DownloadService.downloadFile(url, null, function (status) {
        if (status === 200) {
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENTS_DOWNLOAD_SUCCESSFULLY')
          });
        }
      }, function (err) {
        Notification.error({
          title: 'ERROR',
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_DOWNLOAD_ERROR')
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
      angular.forEach(vm.resourcesTags.radio, function (item) {
        angular.forEach(item.value, function (sitem) {
          if (sitem.name === tag) {
            tmp = item.name;
            find = true;
          }
        });
      });

      if (!find) {
        angular.forEach(vm.resourcesTags.checkbox, function (item) {
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

      if (vm.torrentLocalInfo.resource_detail_info) {
        angular.forEach(vm.torrentLocalInfo.resource_detail_info.credits.crew, function (item) {
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

    vm.getCommentMarked = function (citem) {
      return marked(citem.comment, {sanitize: true});
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
      angular.element('.new_comment_textarea').trigger('focus');
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
      angular.element('.new_comment_textarea').trigger('focus');
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
        angular.element('.new_comment_textarea').trigger('focus');
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
      angular.element('.new_comment_textarea').trigger('focus');
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
      angular.element('.new_comment_textarea').trigger('focus');
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
      //console.log(dataUrl);

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
    function onSuccessItem(res) {
      vm.fileSelected = false;
      vm.sFile = undefined;

      console.log(res);
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
     * downloadSubtitle
     * @param sub
     */
    vm.downloadSubtitle = function (evt, sub) {
      //evt.preventDefault();

      var url = '/api/subtitles/' + vm.torrentLocalInfo._id.toString() + '/' + sub._id.toString();
      DownloadService.downloadFile(url, null, function (status) {
        if (status === 200) {
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('SUBTITLE_DOWNLOAD_SUCCESSFULLY')
          });
        }
      }, function (err) {
        console.log(err);
        Notification.error({
          title: 'ERROR',
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('SUBTITLE_DOWNLOAD_ERROR')
        });
      });
    };


    /**
     * openTorrentInfo
     * @param id
     */
    vm.openTorrentInfo = function (id) {
      var url = $state.href('torrents.view', {torrentId: id});
      window.open(url, '_blank');
    };

    /**
     * getSaleTypeDesc
     */
    vm.getSaleTypeDesc = function () {
      var desc = '';

      angular.forEach(vm.torrentSalesType.value, function (st) {
        if (st.name === vm.torrentLocalInfo.torrent_sale_status) {
          desc = st.desc;
        }
      });
      return desc;
    };

    /**
     * deleteTorrent
     */
    vm.deleteTorrent = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('TORRENT_DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('TORRENT_DELETE_CONFIRM_OK'),
        headerText: $translate.instant('TORRENT_DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('TORRENT_DELETE_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          vm.torrentLocalInfo.$remove(function (response) {
            successCallback(response);
          }, function (errorResponse) {
            errorCallback(errorResponse);
          });

          function successCallback(res) {
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_DELETE_SUCCESSFULLY')
            });

            $state.go('torrents.movie');
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
      TorrentsService.setSaleType({
        _torrentId: vm.torrentLocalInfo._id,
        _saleType: vm.model_salestype
      }, function (res) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_SETSALETYPE_SUCCESSFULLY')
        });

        vm.torrentLocalInfo = res;
      }, function (res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_SETSALETYPE_ERROR')
        });
      });
    };

    /**
     * setRecommendLevel
     */
    vm.setRecommendLevel = function () {
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
    };

    /**
     * beginThumbsUp
     * @param t, torrent
     */
    vm.beginThumbsUp = function (t) {
      t.$thumbsUp(function (res) {
        vm.torrentLocalInfo = res;

        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_THUMBS_SUCCESSFULLY')
        });
      }, function (res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_THUMBS_FAILED')
        });
      });
    };
  }
}());
