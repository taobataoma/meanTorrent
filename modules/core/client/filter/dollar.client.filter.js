(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('core')
    .filter('dollar', dollar);

  dollar.$inject = ['$translate'];

  function dollar($translate) {
    return function (number, precision) {
      if (number === 0 || isNaN(parseFloat(number)) || !isFinite(number)) return '-';
      if (typeof precision === 'undefined') precision = 1;
      return '$' + (number / 1000000).toFixed(precision) + ' ' + $translate.instant('UNIT_MILLION');
    };
  }
}());
