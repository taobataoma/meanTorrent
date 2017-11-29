(function () {
  'use strict';

  angular
    .module('users')
    .controller('PasswordController', PasswordController);

  PasswordController.$inject = ['$scope', '$stateParams', 'UsersService', '$location', 'Authentication', 'PasswordValidator', 'NotifycationService'];

  function PasswordController($scope, $stateParams, UsersService, $location, Authentication, PasswordValidator, NotifycationService) {
    var vm = this;

    vm.resetUserPassword = resetUserPassword;
    vm.askForPasswordReset = askForPasswordReset;
    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    function askForPasswordReset(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.forgotPasswordForm');

        return false;
      }
      vm.isSendingMail = true;

      UsersService.requestPasswordReset(vm.credentials)
        .then(onRequestPasswordResetSuccess)
        .catch(onRequestPasswordResetError);
    }

    // Change user password
    function resetUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.resetPasswordForm');

        return false;
      }

      UsersService.resetPassword($stateParams.token, vm.passwordDetails)
        .then(onResetPasswordSuccess)
        .catch(onResetPasswordError);
    }

    // Password Reset Callbacks

    function onRequestPasswordResetSuccess(response) {
      // Show user success message and clear form
      vm.credentials = null;
      vm.isSendingMail = false;
      vm.isSendingMailOK = true;
      vm.resetTranslate = response.message;
      NotifycationService.showSuccessNotify(response.message);
    }

    function onRequestPasswordResetError(response) {
      // Show user error message and clear form
      vm.credentials = null;
      vm.isSendingMail = false;
      NotifycationService.showErrorNotify(response.data.message, 'SIGN.REST_MAIL_SEND_FAILED');
    }

    function onResetPasswordSuccess(response) {
      // If successful show success message and clear form
      vm.passwordDetails = null;

      // Attach user profile
      Authentication.user = response;
      NotifycationService.showSuccessNotify('PASSWORD_RESET_SUCCESSFULLY');
      // And redirect to the index page
      $location.path('/password/reset/success');
    }

    function onResetPasswordError(response) {
      NotifycationService.showErrorNotify(response.data.message, 'SIGN.PASSWORD_RESET_FAILED');
    }
  }
}());
