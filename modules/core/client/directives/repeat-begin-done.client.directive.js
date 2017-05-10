(function () {
  'use strict';

  angular.module('core')
    .directive('repeatBegin', repeatBegin);

  function repeatBegin() {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      if (scope.$first) {
        if (attrs.repeatBegin) {
          scope.$eval(attrs.repeatBegin);
        }
      }
    }
  }

  angular.module('core')
    .directive('repeatDone', repeatDone);

  function repeatDone() {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      if (scope.$last) {
        if (attrs.repeatDone) {
          scope.$eval(attrs.repeatDone);
        }
      }
    }
  }
}());
