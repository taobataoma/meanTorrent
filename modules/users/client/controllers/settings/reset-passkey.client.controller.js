(function () {
  'use strict';

  angular
    .module('users')
    .controller('ResetPasskeyController', ResetPasskeyController);

  ResetPasskeyController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'UsersService', 'Notification', 'ModalConfirmService'];

  function ResetPasskeyController($scope, $state, $translate, Authentication, UsersService, Notification, ModalConfirmService) {
    var vm = this;
    vm.user = Authentication.user;

    /**
     * resetPasskey
     */
    vm.resetPasskey = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('RESET_PASSKEY_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('RESET_PASSKEY_CONFIRM_OK'),
        headerText: $translate.instant('RESET_PASSKEY_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('RESET_PASSKEY_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          UsersService.changePasskey()
            .then(onChangePasswordSuccess)
            .catch(onChangePasswordError);

          function onChangePasswordSuccess(response) {
            vm.user = Authentication.user = response;

            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('RESET_PASSKEY_SUCCESSFULLY')
            });
          }

          function onChangePasswordError(response) {
            Notification.error({
              message: response.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('RESET_PASSKEY_ERROR')
            });
          }
        });
    };
  }
}());
