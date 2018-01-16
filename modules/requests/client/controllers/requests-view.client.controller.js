(function () {
  'use strict';

  angular
    .module('requests')
    .controller('RequestsViewController', RequestsViewController);

  RequestsViewController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'Authentication', 'RequestsService', 'localStorageService', 'MeanTorrentConfig', 'DebugConsoleService',
    'NotifycationService', '$stateParams', 'marked', 'ModalConfirmService', '$compile', 'DownloadService', 'TorrentGetInfoServices', 'ResourcesTagsServices',
    'RequestsCommentsService'];

  function RequestsViewController($scope, $rootScope, $state, $timeout, $translate, Authentication, RequestsService, localStorageService, MeanTorrentConfig, mtDebug,
                                  NotifycationService, $stateParams, marked, ModalConfirmService, $compile, DownloadService, TorrentGetInfoServices, ResourcesTagsServices,
                                  RequestsCommentsService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.requestsConfig = MeanTorrentConfig.meanTorrentConfig.requests;
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.RTS = ResourcesTagsServices;
    vm.show_desc_help = localStorageService.get('requests_view_show_help') || 'yes';

    vm.searchTags = [];
    vm.comment = {};


    /**
     * $watch 'vm.torrentLocalInfo'
     */
    $scope.$watch('vm.request', function (newValue, oldValue) {
      if (vm.request && vm.request.comments) {
        var hasme = false;
        var meitem = null;

        if (newValue && oldValue) {
          if (newValue.comments.length > oldValue.comments.length) {
            angular.forEach(newValue.comments, function (n) {
              if (oldValue.comments.indexOf(n) < 0) {
                if (n.user._id.toString() === vm.user._id) {
                  hasme = true;
                  meitem = n;
                }
              }
            });
          }
        }

        if (hasme) {
          var totalPages = vm.commentItemsPerPage < 1 ? 1 : Math.ceil(newValue.comments.length / vm.commentItemsPerPage);
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
     * getRequestsDesc
     * @returns {*}
     */
    vm.getRequestsDesc = function () {
      var ts = $translate.instant('REQUESTS.DESC_VIEW', {
        days: vm.requestsConfig.requestExpires / (60 * 60 * 1000 * 24)
      });

      return marked(ts, {sanitize: true});
    };

    /**
     * getRequestDescContent
     * @param q
     * @returns {*}
     */
    vm.getRequestDescContent = function (q) {
      return q ? marked(q.desc, {sanitize: true}) : '';
    };

    /**
     * init
     */
    vm.init = function () {
      RequestsService.get({
        requestId: $stateParams.requestId
      }, function (res) {
        vm.request = res;
        mtDebug.info(vm.request);
        vm.commentBuildPager();
      });

    };

    /**
     * isCurrentUserOwner
     * @returns {boolean}
     */
    vm.isCurrentUserOwner = function () {
      if (vm.request) {
        return vm.request.user._id === vm.user._id
      } else {
        return false;
      }
    };

    /**
     * commentBuildPager
     * pagination init
     */
    vm.commentBuildPager = function () {
      vm.commentPagedItems = [];
      vm.commentItemsPerPage = vm.itemsPerPageConfig.requestCommentsPerPage;
      vm.commentCurrentPage = 1;
      vm.commentFigureOutItemsToDisplay();
    };

    /**
     * commentFigureOutItemsToDisplay
     * @param callback
     */
    vm.commentFigureOutItemsToDisplay = function (callback) {
      vm.commentFilterLength = vm.request.comments.length;
      var begin = ((vm.commentCurrentPage - 1) * vm.commentItemsPerPage);
      var end = begin + vm.commentItemsPerPage;
      vm.commentPagedItems = vm.request.comments.slice(begin, end);

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
     * scrollToElement
     * @param id
     */
    vm.scrollToElement = function (id) {
      var element = angular.element(id);
      console.log(element);

      $timeout(function () {
        $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 300, function () {
          if (id === '#top_of_new_comment') {
            angular.element('#commentContent').trigger('focus');
          }
        });
      }, 100);
    };

    /**
     * beginEditMakerDesc
     * @param m
     */
    vm.beginEditMakerDesc = function (m) {
      var el = $('#' + m._id);

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
            vm.request.desc = e.getContent();
            vm.request.$update(function (res) {
              vm.request = res;
              NotifycationService.showSuccessNotify('REQUESTS.EDIT_DESC_SUCCESSFULLY');
            }, function (res) {
              NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.EDIT_DESC_FAILED');
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

          e.setContent(m.desc);
          $('#' + e.$editor.attr('id') + ' .md-input').attr('maxlength', vm.inputLengthConfig.requestDescLength);

          var elei = $('#' + e.$editor.attr('id') + ' .md-input');
          angular.element(elei).css('height', '200px');
          angular.element(elei).css('color', '#333');

          var inputInfo = angular.element('<span></span>');
          inputInfo.addClass('pull-right');
          inputInfo.addClass('input-length');
          inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.requestDescLength);
          $('#' + e.$editor.attr('id') + ' .md-header').append(inputInfo);
          $('#' + e.$editor.attr('id') + ' .md-input').on('input propertychange', function (evt) {
            inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.requestDescLength);
          });

          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
          angular.element(ele).addClass('text-right');
          angular.element(ele[0].childNodes[0]).addClass('btn-width-80');
          ele[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-default btn-width-80 margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
          cbtn.bind('click', function (evt) {
            e.setContent(m.desc);
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
     * removeRequest
     */
    vm.removeRequest = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('REQUESTS.DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('REQUESTS.DELETE_CONFIRM_OK'),
        headerText: $translate.instant('REQUESTS.DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('REQUESTS.DELETE_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          vm.request.$remove(function (res) {
            NotifycationService.showSuccessNotify('REQUESTS.DELETE_SUCCESSFULLY');
            $state.go($state.previous.state.name || 'requests.list');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.DELETE_FAILED');
          });
        });
    };

    /**
     * onRequestTitleEdited
     */
    $scope.onRequestTitleEdited = function (modifyed) {
      if (vm.request && modifyed) {
        vm.request.$update(function (res) {
          vm.request = res;
          NotifycationService.showSuccessNotify('REQUESTS.EDIT_SUCCESSFULLY');
        }, function (res) {
          NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.EDIT_FAILED');
        });
      }
    };

    /**
     * acceptResponse
     */
    vm.acceptResponse = function (t) {
      var modalOptions = {
        closeButtonText: $translate.instant('REQUESTS.ACCEPT_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('REQUESTS.ACCEPT_CONFIRM_OK'),
        headerText: $translate.instant('REQUESTS.ACCEPT_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('REQUESTS.ACCEPT_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          vm.request.$accept({
            torrentId: t._id
          }, function (res) {
            vm.request = res;
            NotifycationService.showSuccessNotify('REQUESTS.ACCEPT_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.ACCEPT_FAILED');
          });
        });
    };

    /**
     * isExpired
     * @returns {boolean}
     */
    vm.isExpired = function (r) {
      var exp = false;
      if (r) {
        exp = ((moment(r.createdAt) + vm.requestsConfig.requestExpires) > moment(Date.now())) ? false : true;
      }

      return exp;
    };

    /**
     * onShowHelpClicked
     */
    vm.onShowHelpClicked = function () {
      var e = $('.requests-desc');

      if (e.hasClass('panel-collapsed')) {
        e.slideDown();
        e.removeClass('panel-collapsed');
        localStorageService.set('requests_view_show_help', 'yes');
      } else {
        e.slideUp();
        e.addClass('panel-collapsed');
        localStorageService.set('requests_view_show_help', 'no');
      }
    };

    /**
     * onCloseHelpClicked
     */
    vm.onCloseHelpClicked = function () {
      var e = $('.requests-desc');

      if (!e.hasClass('panel-collapsed')) {
        e.slideUp();
        e.addClass('panel-collapsed');
        localStorageService.set('requests_view_show_help', 'no');
      }
    };

    /**
     * submitInit
     */
    vm.submitInit = function () {
      vm.comment = {};
      vm.comment.content = '';
      vm.comment.to_id = undefined;
      vm.comment.to_sub_id = undefined;
      vm.comment.to_at = undefined;
      vm.comment.action = undefined;
    };

    /**
     * submitComment
     */
    vm.submitComment = function () {
      if (vm.comment.action === 'edit') {
        vm.submitEditComment();
        return;
      }

      var comment = new RequestsCommentsService({
        _requestId: vm.request._id,
        _commentId: vm.comment.to_id,
        comment: vm.comment.content
      });

      comment.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.scrollToId = vm.comment.to_id;
        vm.submitInit();
        vm.request = res;
        NotifycationService.showSuccessNotify('REQUESTS.COMMENT_CREATE_SUCCESS');
      }

      function errorCallback(res) {
        vm.error_msg = res.data.message;
        NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.COMMENT_CREATE_ERROR');
      }
    };

    /**
     * submitEditComment
     */
    vm.submitEditComment = function () {
      var comment = new RequestsCommentsService({
        _requestId: vm.request._id,
        _commentId: vm.comment.to_id,
        _subCommentId: vm.comment.to_sub_id,
        comment: vm.comment.content
      });

      comment.$update(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.scrollToId = vm.comment.to_id;
        vm.submitInit();
        vm.request = res;
        NotifycationService.showSuccessNotify('REQUESTS.COMMENT_EDIT_SUCCESS');
      }

      function errorCallback(res) {
        vm.error_msg = res.data.message;
        NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.COMMENT_EDIT_ERROR');
      }
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
      vm.comment.to_id = citem._id;
      vm.comment.to_at = '@' + citem.user.displayName + ': ';
      vm.comment.action = 'reply';

      vm.comment.content = vm.comment.to_at;
      angular.element('#commentContent').trigger('focus');
    };

    /**
     * replySubComment
     * @param citem, comment item
     */
    vm.replySubComment = function (citem, sitem) {
      vm.comment.to_id = citem._id;
      vm.comment.to_at = '@' + sitem.user.displayName + ': ';
      vm.comment.action = 'reply';

      vm.comment.content = vm.comment.to_at;
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
        vm.comment.to_id = citem._id;
        vm.comment.to_at = evt.originalEvent.srcElement.innerText + ': ';
        vm.comment.action = 'reply';

        vm.comment.content = vm.comment.to_at;
        angular.element('#commentContent').trigger('focus');
      }
    };

    /**
     * editComment
     * @param citem
     */
    vm.editComment = function (citem) {
      vm.comment.to_id = citem._id;
      vm.comment.action = 'edit';

      vm.comment.content = citem.comment;
      angular.element('#commentContent').trigger('focus');
    };

    /**
     * editSubComment
     * @param citem
     * @param sitem
     */
    vm.editSubComment = function (citem, sitem) {
      vm.comment.to_id = citem._id;
      vm.comment.to_sub_id = sitem._id;
      vm.comment.action = 'edit';

      vm.comment.content = sitem.comment;
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
          var comment = new RequestsCommentsService({
            _requestId: vm.request._id,
            _commentId: citem._id
          });

          comment.$remove(function (response) {
            successCallback(response);
          }, function (errorResponse) {
            errorCallback(errorResponse);
          });

          function successCallback(res) {
            vm.submitInit();
            vm.scrollToId = undefined;
            vm.request = res;
            NotifycationService.showSuccessNotify('REQUESTS.COMMENT_REMOVE_SUCCESS');
          }

          function errorCallback(res) {
            vm.error_msg = res.data.message;
            NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.COMMENT_REMOVE_ERROR');
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
          var comment = new RequestsCommentsService({
            _requestId: vm.request._id,
            _commentId: citem._id,
            _subCommentId: sitem._id
          });

          comment.$remove(function (response) {
            successCallback(response);
          }, function (errorResponse) {
            errorCallback(errorResponse);
          });

          function successCallback(res) {
            vm.submitInit();
            vm.scrollToId = undefined;
            vm.request = res;
            NotifycationService.showSuccessNotify('REQUESTS.COMMENT_REMOVE_SUCCESS');
          }

          function errorCallback(res) {
            vm.error_msg = res.data.message;
            NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.COMMENT_REMOVE_ERROR');
          }
        });
    };

  }
}());
