(function () {
  'use strict';

  angular.module('core')
    .directive('mtScale', mtScale);

  function mtScale() {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      if (attrs.mtScale) {
        var mtScale = JSON.parse(JSON.stringify(eval('(' + attrs.mtScale + ')')));
        console.log(mtScale);
        element.css('transition-property', 'transform, opacity');
        console.log('mtScale.duration=' + mtScale['duration']);
        element.css('transition-duration', mtScale.duration || '.5s');
        console.log('mtScale.function=' + mtScale.function);
        element.css('transition-timing-function', mtScale.function || 'ease');

        console.log('mtScale.scale=' + mtScale.scale);
        element.on('mouseenter', function () {
          element.css('transform', 'scale(' + (mtScale.scale || 1.1) + ')');
        });
        element.on('mouseleave', function () {
          element.css('transform', 'scale(1)');
        });

      }
    }
  }
}());
