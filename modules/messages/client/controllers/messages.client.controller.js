(function () {
  'use strict';

  angular
    .module('messages')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$filter', 'NotifycationService', '$stateParams', 'MessagesService',
    'MeanTorrentConfig', 'ModalConfirmService', 'marked', '$rootScope', 'AdminMessagesService', 'SideOverlay', '$interval'];

  function MessageController($scope, $state, $translate, $timeout, Authentication, $filter, NotifycationService, $stateParams, MessagesService,
                             MeanTorrentConfig, ModalConfirmService, marked, $rootScope, AdminMessagesService, SideOverlay, $interval) {
    var vm = this;
    vm.messageConfig = MeanTorrentConfig.meanTorrentConfig.messages;
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;
    vm.user = Authentication.user;
    vm.messageFields = {};
    vm.deleteList = [];

    /**
     * user-unread-count-changed
     */
    $scope.$on('user-unread-count-changed', function (event, args) {
      vm.getCountUnread();
    });

    /**
     * checkSendTo
     */
    vm.checkSendTo = function () {
      if ($stateParams.to) {
        var t = $stateParams.to.split('|');
        if (t.length === 2) {
          vm.messageFields.to_user = t[0];
          vm.messageFields.sendTo = t[1];
          vm.sendToReadonly = true;
        }
      }
    };

    /**
     * sendMessage
     * @param isValid
     */
    vm.sendMessage = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.messageForm');
        return false;
      }

      var msg = new MessagesService(vm.messageFields);
      msg.type = 'user';

      msg.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.messageFields = {};
        $scope.$broadcast('show-errors-reset', 'vm.messageForm');
        NotifycationService.showSuccessNotify('MESSAGE_SEND_SUCCESSFULLY');

        $state.go($state.previous.state.name || 'messages.send', $state.previous.params, {reload: true, to: undefined});
      }

      function errorCallback(res) {
        NotifycationService.showErrorNotify(res.data.message, 'MESSAGE_SEND_FAILED');
      }
    };

    /**
     * init
     */
    vm.init = function () {
      vm.getMessageList();
      $interval(vm.getMessageList, vm.messageConfig.checkUnreadInterval);
    };

    /**
     * getMessageList
     */
    vm.getMessageList = function () {
      MessagesService.query(function (data) {
        vm.messages = data;
        vm.buildPager();
      });

      vm.getCountUnread();
    };

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     */
    vm.figureOutItemsToDisplay = function () {
      vm.filteredItems = $filter('filter')(vm.messages, {
        $: vm.search
      });
      vm.filteredItems = $filter('orderBy')(vm.filteredItems, ['-updatedat']);
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      vm.selectedMessage = undefined;
      vm.hideMessage();
      vm.figureOutItemsToDisplay();
    };

    /**
     * deleteSelected
     */
    vm.deleteSelected = function () {
      vm.deleteList = [];
      var modalOptions = {
        closeButtonText: $translate.instant('MESSAGE_DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('MESSAGE_DELETE_CONFIRM_OK'),
        headerText: $translate.instant('MESSAGE_DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('MESSAGE_DELETE_CONFIRM_BODY_TEXT_MANY')
      };

      angular.forEach(vm.selected, function (item, id) {
        if (item) {
          vm.deleteList.push(id);
        }
      });

      if (vm.deleteList.length > 0) {
        ModalConfirmService.showModal({}, modalOptions)
          .then(function (result) {
            MessagesService.remove({
              ids: vm.deleteList
            }, function (res) {
              //$state.reload();
              var s = [];
              angular.forEach(vm.messages, function (m) {
                if (vm.deleteList.indexOf(m._id) !== -1) {
                  s.push(m);
                }
              });

              angular.forEach(s, function (m) {
                vm.messages.splice(vm.messages.indexOf(m), 1);
              });
              vm.figureOutItemsToDisplay();

              NotifycationService.showSuccessNotify('MESSAGE_DELETED_SUCCESSFULLY');
            }, function (res) {
              NotifycationService.showErrorNotify(res.data.message, 'MESSAGE_DELETED_ERROR');
            });
          });
      }
    };

    /**
     * showMessage
     * @param evt
     * @param msg
     */
    vm.showMessage = function (evt, msg) {
      if (SideOverlay.isOpened('popupSlide')) {
        SideOverlay.close(evt, 'popupSlide', function () {
          vm.selectedMessage = msg;
          SideOverlay.open(evt, 'popupSlide');
        });
      } else {
        vm.selectedMessage = msg;
        SideOverlay.open(evt, 'popupSlide');
      }

      vm.replyContent = undefined;
      vm.updateReadStatus(msg);
    };

    /**
     * onPopupMessageOpen
     */
    vm.onPopupMessageOpen = function () {
      $('.reply-textarea').focus();
    };

    /**
     * hideMessage
     */
    vm.hideMessage = function () {
      vm.selectedMessage = undefined;
      SideOverlay.close(null, 'popupSlide');
    };

    /**
     * onReplyKeyDown
     * @param e
     */
    vm.onReplyKeyDown = function (e) {
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
     * updateReadStatus
     * @param m
     */
    vm.updateReadStatus = function (m) {
      var msg;
      if (m.type === 'user') {
        msg = new MessagesService({
          _messageId: m._id
        });

        if (fromIsMe(m)) {
          msg.from_status = 1;
        }
        if (toIsMe(m)) {
          msg.to_status = 1;
        }

        msg.$update(function (res) {
          updateEnd(res);
        });
      } else { //system message
        msg = new AdminMessagesService({
          _adminMessageId: m._id
        });

        msg.$update(function (res) {
          updateEnd(res);
        });
      }

      function updateEnd(res) {
        vm.selectedMessage = res;

        vm.messages.splice(vm.messages.indexOf(m), 0, res);
        vm.messages.splice(vm.messages.indexOf(m), 1);
        vm.figureOutItemsToDisplay();

        $rootScope.$broadcast('user-unread-count-changed');
      }
    };

    /**
     * getCountUnread
     */
    vm.getCountUnread = function () {
      if (Authentication.user) {
        MessagesService.countUnread(function (data) {
          vm.unreadCount = data.countFrom + data.countTo + data.countAdmin;
        });
      }
    };

    /**
     * isUnread
     * @param m
     * @returns {*}
     */
    vm.isUnread = function (m) {
      if (m) {
        if (m.from_user._id === vm.user._id) {
          if (m.from_status === 0) {
            return true;
          }
        }
        if (m.type === 'user') {
          if (m.to_user._id === vm.user._id) {
            if (m.to_status === 0) {
              return true;
            }
          }
        } else {    //not user message
          if (m._readers.indexOf(vm.user._id) < 0) {
            return true;
          }
        }
      }
      return false;
    };

    /**
     * getContentMarked
     * @param m
     * @returns {*}
     */
    vm.getContentMarked = function (m) {
      if (m) {
        return marked(m.content, {sanitize: true});
      }
    };

    /**
     * replyMessage
     */
    vm.replyMessage = function (m) {
      var rmsg = new MessagesService({
        _messageId: m._id,
        title: '',
        content: vm.replyContent,
        type: 'user',
        from_user: vm.user._id,
        to_user: fromIsMe(m) ? m.to_user._id : m.from_user._id
      });

      rmsg.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.selectedMessage = res;

        vm.messages.splice(vm.messages.indexOf(m), 0, res);
        vm.messages.splice(vm.messages.indexOf(m), 1);
        vm.figureOutItemsToDisplay();

        vm.replyContent = undefined;
        NotifycationService.showSuccessNotify('MESSAGE_SEND_SUCCESSFULLY');
      }

      function errorCallback(res) {
        NotifycationService.showErrorNotify(res.data.message, 'MESSAGE_SEND_FAILED');
      }

    };

    /**
     * fromIsMe
     * @param m
     * @returns {boolean}
     */
    function fromIsMe(m) {
      return (m.from_user._id === vm.user._id) ? true : false;
    }

    /**
     * toIsMe
     * @param m
     * @returns {boolean}
     */
    function toIsMe(m) {
      return (m.to_user._id === vm.user._id) ? true : false;
    }

    /**
     * delete
     * @param m
     */
    vm.delete = function (m) {
      vm.deleteList = [];
      var modalOptions = {
        closeButtonText: $translate.instant('MESSAGE_DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('MESSAGE_DELETE_CONFIRM_OK'),
        headerText: $translate.instant('MESSAGE_DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('MESSAGE_DELETE_CONFIRM_BODY_TEXT')
      };
      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          var rmsg = new MessagesService({
            _messageId: m._id
          });

          rmsg.$remove(function (res) {
            vm.messages.splice(vm.messages.indexOf(m), 1);
            vm.figureOutItemsToDisplay();
            vm.hideMessage();

            NotifycationService.showSuccessNotify('MESSAGE_DELETED_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'MESSAGE_DELETED_ERROR');
          });
        });

    };
  }
}());
