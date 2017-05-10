(function () {
  'use strict';

  angular.module('core')
    .directive('mtScroll', mtScroll);

  function mtScroll() {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      if (attrs.mtScroll) {
        $(element).on('scroll', function (evt) {
          scope.$eval(attrs.mtScroll, {$event: event});
        });
      }
    }
  }
}());
