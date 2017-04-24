(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsInfoController', TorrentsInfoController);

  TorrentsInfoController.$inject = ['$scope', '$state', '$stateParams', '$translate', 'Authentication', 'Notification', 'TorrentsService',
    'MeanTorrentConfig', 'DownloadService', '$sce', '$filter', 'CommentsService', 'ModalConfirmService'];

  function TorrentsInfoController($scope, $state, $stateParams, $translate, Authentication, Notification, TorrentsService, MeanTorrentConfig,
                                  DownloadService, $sce, $filter, CommentsService, ModalConfirmService) {
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
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Comment created successfully!'});

        if (vm.comment_to_id) {
          vm.scrollToId = vm.comment_to_id;
        }
        vm.submitInit();
        vm.torrentLocalInfo = res;
      }

      function errorCallback(res) {
        vm.submitInit();
        vm.error_msg = res.data.message;
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Comment created error!'});
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
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Comment edited successfully!'});

        if (vm.comment_to_id) {
          vm.scrollToId = vm.comment_to_id;
        }
        vm.submitInit();
        vm.torrentLocalInfo = res;
      }

      function errorCallback(res) {
        vm.submitInit();
        vm.error_msg = res.data.message;
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Comment edited error!'});
      }
    };

    /**
     * submitCancel
     */
    vm.submitInit = function () {
      vm.new_comment_content = '';
      vm.comment_to_id = undefined;
      vm.comment_to_sub_id = undefined;
      vm.comment_to_at = undefined;
      vm.reply_action = undefined;
    };

    /**
     * replyComment
     * @param citem, comment item
     */
    vm.replyComment = function (citem) {
      vm.comment_to_id = citem._id;
      vm.comment_to_at = '@' + citem.user.displayName + ' ';
      vm.new_comment_content = vm.comment_to_at;
      angular.element('.new_comment_textarea').trigger('focus');
    };

    /**
     * replySubComment
     * @param citem, comment item
     */
    vm.replySubComment = function (citem, sitem) {
      vm.comment_to_id = citem._id;
      vm.comment_to_at = '@' + sitem.user.displayName + ' ';
      vm.new_comment_content = vm.comment_to_at;
      angular.element('.new_comment_textarea').trigger('focus');
    };

    /**
     * getSubMarkdown
     * @param sitem
     * @returns {string}
     */
    vm.getSubMarkdown = function (sitem) {
      var mk = '  <span style="font-size: 12px;">' + '- [@' + sitem.user.displayName + '](@' + sitem.user.displayName + ')</span>  ';
      mk += '<span style="font-size: 12px; color: #999999;">' + $filter('date')(sitem.createdat, 'yyyy-MM-dd HH:mm:ss') + '</span>';

      mk += '<span class="glyphicon glyphicon-edit edit-button" ';
      mk += 'title="{{ \'COMMENT_EDIT_ICON_TITLE\' | translate}}" ';
      mk += 'ng-if="sitem.user._id.equals(vm.user._id) || vm.user.roles[0] == \'admin\'" ';
      mk += 'ng-click="vm.editSubComment(item,sitem);">';
      mk += '</span>';

      mk += '<span class="glyphicon glyphicon-remove-circle delete-button" ';
      mk += 'title="{{ \'COMMENT_DELETE_ICON_TITLE\' | translate}}" ';
      mk += 'ng-if="sitem.user._id.equals(vm.user._id) || vm.user.roles[0] == \'admin\'" ';
      mk += 'ng-click="vm.deleteSubComment(item,sitem);">';
      mk += '</span>';

      return mk;
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
        vm.comment_to_at = evt.originalEvent.srcElement.innerText + ' ';

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
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Comment deleted successfully!'});

            vm.submitInit();
            vm.torrentLocalInfo = res;
          }

          function errorCallback(res) {
            vm.error_msg = res.data.message;
            Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Comment deleted error!'});
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
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Comment reply deleted successfully!'});

            vm.submitInit();
            vm.torrentLocalInfo = res;
          }

          function errorCallback(res) {
            vm.error_msg = res.data.message;
            Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Comment reply deleted error!'});
          }
        });
    };
  }
}());
