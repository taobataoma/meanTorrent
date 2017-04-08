(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('core')
    .filter('runtime', runtime);

  runtime.$inject = ['$translate'];

  function runtime($translate) {
    return function (number) {
      if (number === 0 || isNaN(parseFloat(number)) || !isFinite(number)) return '-';
      return number + ' ' + $translate.instant('UNIT_MITUTE');
    };
  }
}());
