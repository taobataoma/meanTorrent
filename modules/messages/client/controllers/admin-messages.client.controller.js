(function () {
  'use strict';

  angular
    .module('messages.admin')
    .controller('AdminMessageController', AdminMessageController);

  AdminMessageController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$filter', 'NotifycationService', 'AdminMessagesService',
    'MeanTorrentConfig', 'ModalConfirmService', 'marked', '$rootScope'];

  function AdminMessageController($scope, $state, $translate, $timeout, Authentication, $filter, NotifycationService, AdminMessagesService,
                                  MeanTorrentConfig, ModalConfirmService, marked, $rootScope) {
    var vm = this;
    vm.messageConfig = MeanTorrentConfig.meanTorrentConfig.messages;
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;
    vm.user = Authentication.user;
    vm.messageType = 'system';

    /**
     * sendMessage
     * @param isValid
     */
    vm.sendMessage = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.messageForm');
        return false;
      }

      var msg = new AdminMessagesService(vm.messageFields);
      msg.type = vm.messageType;

      msg.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.messageFields = {};
        $scope.$broadcast('show-errors-reset', 'vm.messageForm');
        NotifycationService.showSuccessNotify('MESSAGE_SEND_SUCCESSFULLY');

        $state.reload();
      }

      function errorCallback(res) {
        NotifycationService.showErrorNotify(res.data.message, 'MESSAGE_SEND_FAILED');
      }
    };

    /**
     * getAdminMessages
     */
    vm.getAdminMessages = function () {
      AdminMessagesService.query(function (data) {
        vm.adminMessages = data;
      });
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
            AdminMessagesService.remove({
              ids: vm.deleteList
            }, function (res) {
              $state.reload();

              NotifycationService.showSuccessNotify('MESSAGE_DELETED_SUCCESSFULLY');
            }, function (res) {
              NotifycationService.showErrorNotify(res.data.message, 'MESSAGE_DELETED_ERROR');
            });
          });
      }
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
  }
}());
