(function () {
  'use strict';

  angular.module('core')
    .directive('mtScaleByParam', mtScaleByParam);

  mtScaleByParam.$inject = ['$compile'];

  function mtScaleByParam($compile) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.mtScaleByParam, function (s) {
        var mtScale = JSON.parse(JSON.stringify(eval('(' + attrs.mtScaleByParam + ')')));

        element.css('transition-property', 'transform, opacity');
        element.css('transition-duration', mtScale.duration || '.5s');
        element.css('transition-timing-function', mtScale.function || 'ease');
      });
      scope.$watch(attrs.mtScaleStart, function (s) {
        var mtScale = JSON.parse(JSON.stringify(eval('(' + attrs.mtScaleByParam + ')')));
        if (s) {
          element.css('transform', 'scale(' + (mtScale.scale || 1.1) + ')');

          element.bind('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd', function (evt) {
            element.css('transform', 'scale(1)');
            element.attr('mt-scale-start', false);
            //$compile(element)(scope);
          });
        }
      });
    }
  }
}());
