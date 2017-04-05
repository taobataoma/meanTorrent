(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('core')
    .filter('life', life);

  life.$inject = ['moment'];

  function life(moment) {
    return function (created) {
      var d = moment().diff(moment(created), 'days');
      var h = moment().diff(moment(created), 'hours');
      var m = moment().diff(moment(created), 'minutes');

      if (d > 0) {
        h = h - d * 24;
        return d + 'D' + h + 'H';
      } else {
        m = m - h + 60;
        return h + 'H' + m + 'M';
      }
    };
  }
}());
