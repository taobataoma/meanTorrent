(function () {
  'use strict';

  angular.module('core')
    .directive('mtScaleByMouse', mtScaleByMouse);

  function mtScaleByMouse() {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.mtScaleByMouse, function (s) {

        var mtScale = JSON.parse(JSON.stringify(eval('(' + attrs.mtScaleByMouse + ')')));

        element.css('transition-property', 'transform, opacity');
        element.css('transition-duration', mtScale.duration || '.5s');
        element.css('transition-timing-function', mtScale.function || 'ease');

        element.on('mouseenter', function () {
          element.css('transform', 'scale(' + (mtScale.scale || 1.1) + ')');
        });
        element.on('mouseleave', function () {
          element.css('transform', 'scale(1)');
        });

      });
    }
  }
}());
