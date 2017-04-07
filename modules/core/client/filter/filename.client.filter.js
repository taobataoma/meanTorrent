(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('core')
    .filter('filename', filename);

  function filename() {
    return function (fname) {
      return fname.substr(0, fname.lastIndexOf('.')) || fname;
    };
  }
}());
