(function () {
  'use strict';

  angular.module('core')
    .filter('filename', filename);

  function filename() {
    return function (fname) {
      if (fname) {
        return fname.substr(0, fname.lastIndexOf('.')) || fname;
      } else {
        return '-';
      }
    };
  }
}());
