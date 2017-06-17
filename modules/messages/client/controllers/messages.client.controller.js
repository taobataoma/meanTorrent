(function () {
  'use strict';

  angular
    .module('messages')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$filter', 'NotifycationService', '$stateParams', 'MessagesService',
    'MeanTorrentConfig', 'ModalConfirmService'];

  function MessageController($scope, $state, $translate, $timeout, Authentication, $filter, NotifycationService, $stateParams, MessagesService,
                             MeanTorrentConfig, ModalConfirmService) {
    var vm = this;
    vm.messageConfig = MeanTorrentConfig.meanTorrentConfig.messages;
    vm.user = Authentication.user;
    vm.messageFields = {};
    vm.deleteList = [];

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    document.getElementById('popupSlide').addEventListener('transitionend', onTransitionEnd, false);

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

        $state.go('messages.send', {reload: true, to: undefined});
      }

      function errorCallback(res) {
        NotifycationService.showErrorNotify(res.data.message, 'MESSAGE_SEND_FAILED');
      }
    };

    /**
     * getMessageList
     */
    vm.getMessageList = function () {
      MessagesService.query(function (data) {
        vm.messages = data;
        vm.buildPager();
      });
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
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
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
     * onTransitionEnd
     * @param event
     */
    function onTransitionEnd(event) {
      console.log('end');

      var e = $('.popup-overlay');
      if (vm.selectedMessage) {
        if (!e.hasClass('popup-visible')) {
          e.addClass('popup-visible');
        }
      }
    }

    /**
     * viewMessage
     * @param msg
     */
    vm.showMessage = function (msg) {
      vm.selectedMessage = msg;

      var e = $('.popup-overlay');
      if (e.hasClass('popup-visible')) {
        e.removeClass('popup-visible');
      }else{
        e.addClass('popup-visible');
      }
    };

    /**
     * hideMessage
     */
    vm.hideMessage = function () {
      vm.selectedMessage = undefined;

      var e = $('.popup-overlay');
      if (e.hasClass('popup-visible')) {
        e.removeClass('popup-visible');
      }
    };
  }
}());
