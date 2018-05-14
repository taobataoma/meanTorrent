(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('core')
    .filter('score', score);

  score.$inject = ['$filter'];

  function score($filter) {
    return function (input, decimals) {
      if (input === 0 || isNaN(parseFloat(input)) || !isFinite(input)) return '0';
      return $filter('number')(input, decimals);
    };
  }
}());
