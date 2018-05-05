(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsTopicController', ForumsTopicController);

  ForumsTopicController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'ScoreLevelService', '$timeout', 'NotifycationService',
    'marked', 'ModalConfirmService', '$stateParams', 'TopicsService', 'localStorageService', '$compile', 'RepliesService', '$filter', 'Upload', 'DownloadService',
    'DebugConsoleService', '$window'];

  function ForumsTopicController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, ScoreLevelService, $timeout, NotifycationService,
                                 marked, ModalConfirmService, $stateParams, TopicsService, localStorageService, $compile, RepliesService, $filter, Upload, DownloadService,
                                 mtDebug, $window) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.scoreConfig = MeanTorrentConfig.meanTorrentConfig.score;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.user = Authentication.user;
    vm.forumPath = [];
    vm.postReplyFields = {};

    angular.element($window).bind('scroll', function (e) {
      var scTop = angular.element('#top_of_reply_list').prop('offsetTop') - 60;
      if ($(window).scrollTop() > scTop) {
        //alert('boom');up-to-top
        angular.element('.up-to-top').css('display', 'block');
      } else {
        angular.element('.up-to-top').css('display', 'none');
      }
    });

    /**
     * upToTop
     */
    vm.upToTop = function () {
      var element = angular.element('#top_of_reply_list');
      $timeout(function () {
        $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
      }, 10);
    };

    /**
     * buildPager
     * pagination init
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.repliesPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.filterLength = vm.topic._replies.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.topic._replies.slice(begin, end);

      if (callback) callback();
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_reply_list');

      vm.figureOutItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
        }, 10);
      });
    };

    /**
     * init
     */
    vm.init = function () {
      // get forum info by state params
      ForumsService.get({
        forumId: $stateParams.forumId
      }, function (item) {
        vm.forum = item;
        vm.forumPath.splice(0, 0, {name: vm.forum.name, state: 'forums.view', params: {forumId: vm.forum._id}});

        // get topics
        TopicsService.get({
          forumId: $stateParams.forumId,
          topicId: $stateParams.topicId
        }, function (topic) {
          mtDebug.info(topic);
          vm.topic = new TopicsService(topic);
          vm.buildPager();

          vm.forumPath.push({name: topic.title, state: undefined});
        });
      }, function (res) {
        if (typeof res.data.redirect == 'string') {
          $state.go(res.data.redirect);
        }
      });
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
     * getUserSignatureMarked
     * @param u
     * @returns {*}
     */
    vm.getUserSignatureMarked = function (u) {
      if (u) {
        return marked(u.signature, {sanitize: true});
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
     * canEdit
     * @returns {boolean}
     */
    vm.canEdit = function () {
      if (vm.user.isOper) {
        return true;
      } else if (vm.isModerator()) {
        return true;
      } else {
        return false;
      }
    };

    /**
     * onTopicTitleEdited
     */
    $scope.onTopicTitleEdited = function (modifyed) {
      if (vm.topic && modifyed) {
        vm.topic.$update(function (res) {
          vm.topic = new TopicsService(res);
          NotifycationService.showSuccessNotify('FORUMS.TOPIC_EDIT_SUCCESSFULLY');
        }, function (res) {
          NotifycationService.showErrorNotify(res.data.message, 'FORUMS.TOPIC_EDIT_FAILED');
        });
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
              vm.topic = new TopicsService(res);
              vm.figureOutItemsToDisplay();
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

          e.setContent(t.content);
          $('#' + e.$editor.attr('id') + ' .md-input').attr('maxlength', vm.inputLengthConfig.forumTopicContentLength);

          var inputInfo = angular.element('<span></span>');
          inputInfo.addClass('pull-right');
          inputInfo.addClass('input-length');
          inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.forumTopicContentLength);
          $('#' + e.$editor.attr('id') + ' .md-header').append(inputInfo);
          $('#' + e.$editor.attr('id') + ' .md-input').on('input propertychange', function (evt) {
            inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.forumTopicContentLength);
          });

          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
          angular.element(ele).addClass('text-right');
          angular.element(ele[0].childNodes[0]).addClass('btn-width-80');
          ele[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-default btn-width-80 margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
          cbtn.bind('click', function (evt) {
            e.setContent(t.content);
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
              vm.topic = new TopicsService(res);
              vm.figureOutItemsToDisplay();
              NotifycationService.showSuccessNotify('FORUMS.REPLY_EDIT_SUCCESSFULLY');
            }, function (res) {
              NotifycationService.showErrorNotify(res.data.message, 'FORUMS.REPLY_EDIT_FAILED');
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

          e.setContent(r.content);
          $('#' + e.$editor.attr('id') + ' .md-input').attr('maxlength', vm.inputLengthConfig.forumReplyContentLength);

          var inputInfo = angular.element('<span></span>');
          inputInfo.addClass('pull-right');
          inputInfo.addClass('input-length');
          inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.forumReplyContentLength);
          $('#' + e.$editor.attr('id') + ' .md-header').append(inputInfo);
          $('#' + e.$editor.attr('id') + ' .md-input').on('input propertychange', function (evt) {
            inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.forumReplyContentLength);
          });

          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
          angular.element(ele).addClass('text-right');
          angular.element(ele[0].childNodes[0]).addClass('btn-width-80');
          ele[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-default btn-width-80 margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
          cbtn.bind('click', function (evt) {
            e.setContent(r.content);
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
     * beginTopTopic
     * @param t
     */
    vm.beginTopTopic = function (t) {
      var topic = new TopicsService({
        forum: vm.forum._id,
        _id: t._id
      });

      topic.$toggleTopicTopStatus(function (res) {
        vm.topic = new TopicsService(res);
        NotifycationService.showSuccessNotify('FORUMS.TOPIC_TOGGLE_TOP_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.TOPIC_TOGGLE_TOP_FAILED');
      });
    };

    /**
     * beginGlobalTopic
     * @param t
     */
    vm.beginGlobalTopic = function (t) {
      var topic = new TopicsService({
        forum: vm.forum._id,
        _id: t._id
      });

      topic.$toggleTopicGlobalStatus(function (res) {
        vm.topic = new TopicsService(res);
        NotifycationService.showSuccessNotify('FORUMS.TOPIC_TOGGLE_GLOBAL_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.TOPIC_TOGGLE_GLOBAL_FAILED');
      });
    };

    /**
     * beginHomeHelpTopic
     * @param t
     */
    vm.beginHomeHelpTopic = function (t) {
      var topic = new TopicsService({
        forum: vm.forum._id,
        _id: t._id
      });

      topic.$toggleTopicHomeHelpStatus(function (res) {
        vm.topic = new TopicsService(res);
        NotifycationService.showSuccessNotify('FORUMS.TOPIC_TOGGLE_HOME_HELP_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.TOPIC_TOGGLE_HOME_HELP_FAILED');
      });
    };

    /**
     * beginHomeNoticeTopic
     * @param t
     */
    vm.beginHomeNoticeTopic = function (t) {
      var topic = new TopicsService({
        forum: vm.forum._id,
        _id: t._id
      });

      topic.$toggleTopicHomeNoticeStatus(function (res) {
        vm.topic = new TopicsService(res);
        NotifycationService.showSuccessNotify('FORUMS.TOPIC_TOGGLE_HOME_NOTICE_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.TOPIC_TOGGLE_HOME_NOTICE_FAILED');
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
            vm.topic = new TopicsService(res);
            vm.figureOutItemsToDisplay();
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
      $('#postReplyContent').focus();
      $timeout(function () {
        $('html,body').animate({scrollTop: $('#post-new-reply-table')[0].offsetTop - 60}, 200);
      }, 10);
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
        vm.topic = new TopicsService(res);
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

      mtDebug.info($scope.uFiles);
      var uf = [];
      angular.forEach($scope.uFiles, function (f) {
        uf.push({
          filename: f.name,
          filesize: f.size
        });
      });

      mtDebug.info($scope.uImages);
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
        vm.currentPage = Math.ceil(res._replies.length / vm.itemsPerPage);
        vm.topic = new TopicsService(res);
        vm.pageChanged();

        $scope.$broadcast('show-errors-reset', 'vm.replyForm');
        $scope.clearnAttach();
        $scope.hidePreview();
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
      var by = obj.user.displayName + ' at ' + $filter('date')((obj.updatedAt ? obj.updatedAt : obj.createdAt), 'yyyy-MM-dd HH:mm');
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
        vm.topic = new TopicsService(res);
        vm.figureOutItemsToDisplay();

        $timeout(function () {
          var ele = angular.element($('#thumbs_' + (r ? r._id : t._id)));
          ele.attr('mt-scale-start', true);
          $compile(ele)($scope);
        }, 10);
      }, function (res) {
        NotifycationService.showErrorNotify($translate.instant(res.data.message), 'ERROR');
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
  }
}());
