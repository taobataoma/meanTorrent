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
      var s = moment().diff(moment(created), 'seconds');

      if (!created) {
        d = 0;
        h = 0;
        m = 0;
        s = 0;
      }

      if (d > 0) {
        h = h - d * 24;
        return d + 'd' + h + 'h';
      } else if (h > 0) {
        m = m - h * 60;
        return h + 'h' + m + 'm';
      } else if (m > 0) {
        s = s - m * 60;
        return m + 'm' + s + 's';
      } else {
        return s + 's';
      }
    };
  }

  angular.module('core')
    .filter('unlife', unlife);

  unlife.$inject = ['moment'];

  function unlife(moment) {
    return function (expires) {
      var d = moment(expires).diff(moment(), 'days');
      var h = moment(expires).diff(moment(), 'hours');
      var m = moment(expires).diff(moment(), 'minutes');
      var s = moment(expires).diff(moment(), 'seconds');

      if (!expires) {
        d = 0;
        h = 0;
        m = 0;
        s = 0;
      }

      if (d > 0) {
        h = h - d * 24;
        return d + 'd' + h + 'h';
      } else if (h > 0) {
        m = m - h * 60;
        return h + 'h' + m + 'm';
      } else if (m > 0) {
        s = s - m * 60;
        return m + 'm' + s + 's';
      } else {
        return s + 's';
      }
    };
  }

  angular.module('core')
    .filter('seedlife', seedlife);

  seedlife.$inject = ['moment'];

  function seedlife(moment) {
    return function (stime) {
      var d = moment(moment() + stime).diff(moment(), 'days');
      var h = moment(moment() + stime).diff(moment(), 'hours');
      var m = moment(moment() + stime).diff(moment(), 'minutes');
      var s = moment(moment() + stime).diff(moment(), 'seconds');

      if (!stime) {
        d = 0;
        h = 0;
        m = 0;
        s = 0;
      }

      if (d > 0) {
        h = h - d * 24;
        return d + 'd' + h + 'h';
      } else if (h > 0) {
        m = m - h * 60;
        return h + 'h' + m + 'm';
      } else if (m > 0) {
        s = s - m * 60;
        return m + 'm' + s + 's';
      } else {
        return s + 's';
      }
    };
  }
}());
