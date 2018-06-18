(function () {
  'use strict';

  angular
    .module('tickets')
    .controller('ViewMessageTicketController', ViewMessageTicketController);

  ViewMessageTicketController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'Authentication', 'MessageTicketsService', 'ModalConfirmService',
    'NotifycationService', 'marked', 'DebugConsoleService', 'MeanTorrentConfig', '$filter', '$stateParams', 'Upload', 'localStorageService', '$compile'];

  function ViewMessageTicketController($scope, $rootScope, $state, $timeout, $translate, Authentication, MessageTicketsService, ModalConfirmService,
                                       NotifycationService, marked, mtDebug, MeanTorrentConfig, $filter, $stateParams, Upload, localStorageService, $compile) {
    var vm = this;
    vm.user = Authentication.user;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.supportConfig = MeanTorrentConfig.meanTorrentConfig.support;
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;

    /**
     * init
     */
    vm.init = function () {
      MessageTicketsService.get({
        messageTicketId: $stateParams.messageTicketId
      }, function (ticket) {
        mtDebug.info(ticket);
        vm.ticket = ticket;
        vm.buildPager();
      });
    };

    /**
     * buildPager
     * pagination init
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.messageTicketRepliesPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.filterLength = vm.ticket._replies.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.ticket._replies.slice(begin, end);

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
     * getTicketContent
     * @param t
     * @returns {*}
     */
    vm.getTicketContent = function (t) {
      if (t) {
        return marked(t.content, {sanitize: true});
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
     * isOwner
     * @param o, ticket
     * @returns {boolean}
     */
    vm.isOwner = function (o) {
      if (o) {
        if (o.from._id === vm.user._id) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    /**
     * onTopicTitleEdited
     */
    $scope.onTopicTitleEdited = function (modifyed) {
      if (vm.ticket && modifyed) {
        vm.ticket.$update(function (res) {
          vm.ticket = res;
          NotifycationService.showSuccessNotify('SUPPORT.TICKET_EDIT_SUCCESSFULLY');
        }, function (res) {
          NotifycationService.showErrorNotify(res.data.message, 'SUPPORT.TICKET_EDIT_FAILED');
        });
      }
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

      mtDebug.info($scope.uImages);
      var uimg = [];
      angular.forEach($scope.uImages, function (f) {
        uimg.push({
          filename: f.name
        });
      });

      var reply = new MessageTicketsService(vm.postReplyFields);
      reply._uImage = uimg;

      reply.$save({
        messageTicketId: vm.ticket._id
      }, function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.postReplyFields = {};
        vm.currentPage = Math.ceil(res._replies.length / vm.itemsPerPage);
        vm.ticket = res;
        $rootScope.$broadcast('opened-tickets-changed');
        vm.pageChanged();

        $scope.$broadcast('show-errors-reset', 'vm.replyForm');
        $scope.clearAttach();
        $scope.hidePreview();
        NotifycationService.showSuccessNotify('FORUMS.POST_REPLY_SUCCESSFULLY');
      }

      function errorCallback(res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.POST_REPLY_FAILED');
      }
    };

    /**
     * uploadTicketImage
     * @param editor
     * @param ufile
     * @param progressback
     * @param callback
     * @param errback
     */
    vm.uploadTicketImage = function (editor, ufile, progressback, callback, errback) {
      Upload.upload({
        url: '/api/messageTickets/uploadTicketImage',
        data: {
          newTicketImageFile: ufile
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
     * beginDeleteTicket
     * @param t
     */
    vm.beginDeleteTicket = function (t) {
      var modalOptions = {
        closeButtonText: $translate.instant('SUPPORT.DELETE_TICKET_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('SUPPORT.DELETE_TICKET_CONFIRM_OK'),
        headerText: $translate.instant('SUPPORT.DELETE_TICKET_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('SUPPORT.DELETE_TICKET_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          MessageTicketsService.remove({
            messageTicketId: t._id,
            replyId: undefined
          }, function (res) {
            NotifycationService.showSuccessNotify('SUPPORT.DELETE_TICKET_SUCCESSFULLY');
            $state.go('admin.tickets.support.message');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'SUPPORT.DELETE_TICKET_FAILED');
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
          MessageTicketsService.remove({
            messageTicketId: vm.ticket._id,
            replyId: reply._id
          }, function (res) {
            vm.ticket = res;
            vm.figureOutItemsToDisplay();
            NotifycationService.showSuccessNotify('FORUMS.DELETE_REPLY_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'FORUMS.DELETE_REPLY_FAILED');
          });
        });
    };

    /**
     * beginEditTicket
     * @param t
     */
    vm.beginEditTicket = function (t) {
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
              vm.ticket = res;
              vm.figureOutItemsToDisplay();
              NotifycationService.showSuccessNotify('SUPPORT.TICKET_EDIT_SUCCESSFULLY');
            }, function (res) {
              NotifycationService.showErrorNotify(res.data.message, 'SUPPORT.TICKET_EDIT_FAILED');
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
          $('#' + e.$editor.attr('id') + ' .md-input').attr('maxlength', vm.inputLengthConfig.ticketContentLength);

          var inputInfo = angular.element('<span></span>');
          inputInfo.addClass('pull-right');
          inputInfo.addClass('input-length');
          inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.ticketContentLength);
          $('#' + e.$editor.attr('id') + ' .md-header').append(inputInfo);
          $('#' + e.$editor.attr('id') + ' .md-input').on('input propertychange', function (evt) {
            inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.ticketContentLength);
          });

          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
          angular.element(ele).addClass('text-right');
          angular.element(ele[0].childNodes[0]).addClass('btn-min-width-80');
          ele[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-default btn-min-width-80 margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
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
            var rep = new MessageTicketsService({
              _id: vm.ticket._id,
              _rid: r._id,
              content: e.getContent()
            });

            rep.$update(function (res) {
              vm.ticket = res;
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
          $('#' + e.$editor.attr('id') + ' .md-input').attr('maxlength', vm.inputLengthConfig.ticketContentLength);

          var inputInfo = angular.element('<span></span>');
          inputInfo.addClass('pull-right');
          inputInfo.addClass('input-length');
          inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.ticketContentLength);
          $('#' + e.$editor.attr('id') + ' .md-header').append(inputInfo);
          $('#' + e.$editor.attr('id') + ' .md-input').on('input propertychange', function (evt) {
            inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.ticketContentLength);
          });

          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
          angular.element(ele).addClass('text-right');
          angular.element(ele[0].childNodes[0]).addClass('btn-min-width-80');
          ele[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-default btn-min-width-80 margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
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
     * handleTicket
     */
    vm.handleTicket = function (t) {
      var modalOptions = {
        closeButtonText: $translate.instant('SUPPORT.HANDLE_TICKET_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('SUPPORT.HANDLE_TICKET_CONFIRM_OK'),
        headerText: $translate.instant('SUPPORT.HANDLE_TICKET_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('SUPPORT.HANDLE_TICKET_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          MessageTicketsService.handle({
            messageTicketId: t._id
          }, function (res) {
            vm.ticket = res;
            NotifycationService.showSuccessNotify('SUPPORT.HANDLE_TICKET_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'SUPPORT.HANDLE_TICKET_FAILED');
          });
        });
    };

    /**
     * solvedTicket
     */
    vm.solvedTicket = function (t) {
      var modalOptions = {
        closeButtonText: $translate.instant('SUPPORT.SOLVED_TICKET_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('SUPPORT.SOLVED_TICKET_CONFIRM_OK'),
        headerText: $translate.instant('SUPPORT.SOLVED_TICKET_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('SUPPORT.SOLVED_TICKET_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          MessageTicketsService.solved({
            messageTicketId: t._id
          }, function (res) {
            vm.ticket = res;
            NotifycationService.showSuccessNotify('SUPPORT.SOLVED_TICKET_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'SUPPORT.SOLVED_TICKET_FAILED');
          });
        });
    };


  }
}());
