(function () {
  'use strict';

  // PasswordValidator service used for testing the password strength
  angular
    .module('users.services')
    .factory('PasswordValidator', PasswordValidator);

  PasswordValidator.$inject = ['$window', '$translate'];

  function PasswordValidator($window, $translate) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    var service = {
      getResult: getResult,
      getPopoverMsg: getPopoverMsg
    };

    return service;

    function getResult(password) {
      var result = owaspPasswordStrengthTest.test(password);
      return result;
    }

    function getPopoverMsg() {
      //var popoverMsg = 'Please enter a passphrase or password with ' + owaspPasswordStrengthTest.configs.minLength + ' or more characters, numbers, lowercase, uppercase, and special characters.';
      var popoverMsg = $translate.instant('SIGN.U_TOOLTIP', {minLength: owaspPasswordStrengthTest.configs.minLength});

      return popoverMsg;
    }
  }

}());
