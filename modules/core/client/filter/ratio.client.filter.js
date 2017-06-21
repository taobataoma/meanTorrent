(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('core')
    .filter('ratio', ratio);

  function ratio() {
    return function (number) {
      if (number === -1) {
        return '∞';
      } else {
        return number;
      }
    };
  }
}());
