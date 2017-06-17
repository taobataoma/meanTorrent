(function () {
  'use strict';

  angular
    .module('messages')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'NotifycationService', '$stateParams', 'MessagesService'];

  function MessageController($scope, $state, $translate, $timeout, Authentication, $window, NotifycationService, $stateParams, MessagesService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.messageFields = {};

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

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
  }
}());
