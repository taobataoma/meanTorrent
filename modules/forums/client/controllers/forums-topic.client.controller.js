(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsTopicController', ForumsTopicController);

  ForumsTopicController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'ScoreLevelService', '$timeout', 'NotifycationService',
    'marked', 'ModalConfirmService', '$stateParams', 'TopicsService', 'localStorageService', '$compile', 'RepliesService', '$filter', 'Upload', 'DownloadService'];

  function ForumsTopicController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, ScoreLevelService, $timeout, NotifycationService,
                                 marked, ModalConfirmService, $stateParams, TopicsService, localStorageService, $compile, RepliesService, $filter, Upload, DownloadService) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.user = Authentication.user;
    vm.forumPath = [];
    vm.postReplyFields = {};

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * init
     */
    vm.init = function () {
      // get forum info by state params
      ForumsService.get({
        forumId: $stateParams.forumId
      }, function (item) {
        console.log(item);
        vm.forum = item;

        vm.forumPath.splice(0, 0, {name: vm.forum.name, state: 'forums.view', params: {forumId: vm.forum._id}});
      });

      // get topics
      TopicsService.get({
        forumId: $stateParams.forumId,
        topicId: $stateParams.topicId
      }, function (topic) {
        console.log(topic);
        vm.topic = topic;

        vm.forumPath.push({name: topic.title, state: undefined});
      });

      $timeout(function () {
        $('html,body').scrollTop(0);
      }, 0);
    };

    /**
     * getTopicContent
     * @param t
     * @returns {*}
     */
    vm.getTopicContent = function (t) {
      if (t) {
        return marked(t.content, {sanitize: true});
      }
    };

    /**
     * getUserScoreLevel
     * @param u
     * @returns {*|l}
     */
    vm.getUserScoreLevel = function (u) {
      var s = ScoreLevelService.getScoreLevelJson(vm.user.score);
      return s.currLevel;
    };

    /**
     * isTopicOwner
     * @param t
     * @returns {boolean}
     */
    vm.isOwner = function (t) {
      if (t) {
        if (t.user._id.str === vm.user._id) {
          return true;
        } else {
          return false;
        }
      }
    };

    /**
     * isModerator
     * @returns {boolean}
     */
    vm.isModerator = function () {
      var isM = false;

      if (vm.forum) {
        angular.forEach(vm.forum.moderators, function (m) {
          if (m._id === vm.user._id) {
            isM = true;
          }
        });
      }

      return isM;
    };

    /**
     * canEditTopic
     * @param t
     * @returns {boolean}
     */
    vm.canEdit = function (t) {
      if (t) {
        if (vm.isModerator() || vm.isOwner(t) || vm.user.isOper) {
          return true;
        } else {
          return false;
        }
      }
    };

    /**
     * beginEditTopic
     * @param t
     */
    vm.beginEditTopic = function (t) {
      var el = $('#' + t._id);

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
            //save content
            t.content = e.getContent();
            t.$update(function (res) {
              vm.topic = res;
              NotifycationService.showSuccessNotify('FORUMS.TOPIC_EDIT_SUCCESSFULLY');
            }, function (res) {
              NotifycationService.showErrorNotify(res.data.message, 'FORUMS.TOPIC_EDIT_FAILED');
            });

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
          e.setContent(t.content);

          angular.element($('.md-footer')).addClass('text-right');
          angular.element($('.md-footer')[0].childNodes[0]).addClass('btn-width-80');
          $('.md-footer')[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-success btn-width-80 margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
          cbtn.bind('click', function (evt) {
            e.setContent(t.content);
            e.$options.hideable = true;
            e.blur();
          });
          $('.md-footer').append(cbtn);
          $compile($('.md-footer').contents())($scope);
        }
      });
    };

    /**
     * beginEditReply
     * @param r
     */
    vm.beginEditReply = function (r) {
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
            //save content
            var rep = new RepliesService({
              forum: vm.forum._id,
              topic: vm.topic._id,
              _id: r._id,
              content: e.getContent()
            });

            rep.$update(function (res) {
              vm.topic = res;
              NotifycationService.showSuccessNotify('FORUMS.REPLY_EDIT_SUCCESSFULLY');
            }, function (res) {
              NotifycationService.showErrorNotify(res.data.message, 'FORUMS.FORUMS');
            });

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
          e.setContent(r.content);
          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
          console.log(ele);

          angular.element(ele).addClass('text-right');
          angular.element(ele[0].childNodes[0]).addClass('btn-width-80');
          ele[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-success btn-width-80 margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
          cbtn.bind('click', function (evt) {
            e.setContent(r.content);
            e.$options.hideable = true;
            e.blur();
          });
          ele.append(cbtn);
          $compile(ele.contents())($scope);
        }
      });
    };

    /**
     * beginDeleteTopic
     * @param t
     */
    vm.beginDeleteTopic = function (t) {
      var modalOptions = {
        closeButtonText: $translate.instant('FORUMS.DELETE_TOPIC_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('FORUMS.DELETE_TOPIC_CONFIRM_OK'),
        headerText: $translate.instant('FORUMS.DELETE_TOPIC_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('FORUMS.DELETE_TOPIC_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          vm.topic.$remove(function (res) {
            NotifycationService.showSuccessNotify('FORUMS.DELETE_TOPIC_SUCCESSFULLY');
            $state.go('forums.view', {forumId: vm.forum._id});
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'FORUMS.DELETE_TOPIC_FAILED');
          });
        });
    };

    /**
     * beginDeleteReply
     * @param reply
     */
    vm.beginDeleteReply = function (reply) {
      var modalOptions = {
        closeButtonText: $translate.instant('FORUMS.DELETE_TOPIC_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('FORUMS.DELETE_TOPIC_CONFIRM_OK'),
        headerText: $translate.instant('FORUMS.DELETE_REPLY_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('FORUMS.DELETE_REPLY_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          RepliesService.remove({
            forumId: vm.forum._id,
            topicId: vm.topic._id,
            replyId: reply._id
          }, function (res) {
            vm.topic = res;
            NotifycationService.showSuccessNotify('FORUMS.DELETE_REPLY_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'FORUMS.DELETE_REPLY_FAILED');
          });
        });
    };

    /**
     * beginPostReply
     */
    vm.beginPostReply = function () {
      vm.scrollToReply = true;
      $('#postReplyContent').focus();
      $timeout(function () {
        $('#postReplyContent').scrollTop($('#postReplyContent')[0].scrollHeight);
      }, 100);
      $timeout(function () {
        vm.scrollToReply = false;
      }, 500);
    };

    /**
     * toggleReadonly
     * @param t
     */
    vm.toggleReadonly = function (t) {
      var topic = new TopicsService({
        forum: vm.forum._id,
        _id: t._id
      });

      topic.$toggleTopicReadonly(function (res) {
        vm.topic = res;
        NotifycationService.showSuccessNotify('FORUMS.TOPIC_TOGGLE_READONLY_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.TOPIC_TOGGLE_READONLY_FAILED');
      });
    };

    /**
     * postReply
     * @param isValid
     * @returns {boolean}
     */
    vm.postReply = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.replyForm');
        return false;
      }

      var uf = [];
      angular.forEach($scope.uFiles, function (f) {
        uf.push({
          filename: f.name,
          filesize: f.size
        });
      });

      var uimg = [];
      angular.forEach($scope.uImages, function (f) {
        uimg.push({
          filename: f.name
        });
      });

      var reply = new RepliesService(vm.postReplyFields);
      reply.forum = vm.forum._id;
      reply.topic = vm.topic._id;
      reply._attach = uf;
      reply._uImage = uimg;

      reply.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.postReplyFields = {};
        vm.topic = res;
        $scope.uFiles = [];
        $scope.uImages = [];

        $scope.$broadcast('show-errors-reset', 'vm.replyForm');
        NotifycationService.showSuccessNotify('FORUMS.POST_REPLY_SUCCESSFULLY');
      }

      function errorCallback(res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.POST_REPLY_FAILED');
      }
    };

    /**
     * quoteAndReply
     * @param obj, topic or reply object, need the content field
     */
    vm.quoteAndReply = function (obj) {
      var by = obj.user.displayName + ' at ' + $filter('date')(obj.updatedAt ? obj.updatedAt : obj.createdAt, 'yyyy-MM-dd HH:mm:ss');
      by = '_' + by + '_' + '\n\n';
      var list = [];

      list = obj.content.split('\n');
      list.push(by);

      $.each(list, function (k, v) {
        list[k] = '> ' + v;
      });

      vm.postReplyFields.content = list.join('\n');
      vm.beginPostReply();
    };

    /**
     * function
     * @param evt
     * @param t
     * @param r
     */
    vm.beginThumbsUp = function (evt, t, r) {
      var topic = new TopicsService({
        forum: vm.forum._id,
        _id: t._id,
        _replyId: r ? r._id : undefined
      });

      topic.$thumbsUp(function (res) {
        vm.topic = res;

        $timeout(function () {
          var ele = angular.element($('#thumbs_' + (r ? r._id : t._id)));
          ele.attr('mt-scale-start', true);
          $compile(ele)($scope);
        }, 10);
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'ERROR');
      });
    };

    /**
     * uploadAttach
     * @param editor
     * @param ufile
     * @param callback
     */
    vm.uploadAttach = function (editor, ufile, progressback, callback, errback) {
      Upload.upload({
        url: '/api/attach/upload',
        data: {
          newAttachFile: ufile
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
     * downloadAttach
     * @param t
     * @param r
     * @param af
     */
    vm.downloadAttach = function (t, r, af) {
      var url = '/api/attach/' + vm.topic._id.toString();
      url += r ? '/' + r._id.toString() : '';
      url += '?attachId=' + af._id.toString();

      DownloadService.downloadFile(url, null, function (status) {
        if (status === 200) {
          NotifycationService.showSuccessNotify('FORUMS.ATTACHE_DOWNLOAD_SUCCESSFULLY');
        }
      }, function (err) {
        console.log(err);
        NotifycationService.showErrorNotify(err.data.message, 'FORUMS.ATTACHE_DOWNLOAD_FAILED');
      });
    };
  }
}());
