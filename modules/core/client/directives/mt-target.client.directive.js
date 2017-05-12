(function () {
  'use strict';

  angular.module('core')
    .directive('mtTarget', mtTarget);

  function mtTarget() {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      if (attrs.mtTarget) {
        attrs.$set('target', attrs.mtTarget);
      }
    }
  }
}());
