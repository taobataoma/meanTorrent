(function () {
  'use strict';

  angular.module('core')
    .directive('mtScaleByClick', mtScaleByClick);

  mtScaleByClick.$inject = ['$compile'];

  function mtScaleByClick($compile) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.mtScaleByClick, function (s) {
        var mtScale = JSON.parse(JSON.stringify(eval('(' + attrs.mtScaleByClick + ')')));

        element.css('transition-property', 'transform, opacity');
        element.css('transition-duration', mtScale.duration || '.5s');
        element.css('transition-timing-function', mtScale.function || 'ease');
      });
      element.bind('click', function (s) {
        var mtScale = JSON.parse(JSON.stringify(eval('(' + attrs.mtScaleByClick + ')')));
        if (s) {
          element.css('transform', 'scale(' + (mtScale.scale || 1.1) + ')');

          element.bind('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd', function (evt) {
            element.css('transform', 'scale(1)');
          });
        }
      });
    }
  }
}());
