(function () {
  'use strict';

  angular.module('core')
    .directive('mtRotateByMouse', mtRotateByMouse);

  function mtRotateByMouse() {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.mtRotateByMouse, function (s) {

        var mtRotate = JSON.parse(JSON.stringify(eval('(' + attrs.mtRotateByMouse + ')')));

        element.css('transition-property', 'transform, opacity');
        element.css('transition-duration', mtRotate.duration || '.5s');
        element.css('transition-timing-function', mtRotate.function || 'ease');

        element.on('mouseenter', function () {
          element.css('transform', 'rotate(360deg)');
        });
        element.on('mouseleave', function () {
          element.css('transform', 'rotate(0deg)');
        });

      });
    }
  }
}());
