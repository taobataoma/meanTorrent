(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('core')
    .filter('bytes', bytes);

  function bytes() {
    return function (bytes, precision) {
      if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0';
      if (typeof precision === 'undefined') precision = 1;

      var absBytes = Math.abs(bytes);
      //var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
      var units = ['b', 'K', 'M', 'G', 'T', 'P'],
        number = Math.floor(Math.log(absBytes) / Math.log(1024));

      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + units[number];
    };
  }
}());
