(function () {
  'use strict';

  angular.module('core')
    .directive('scoreLevel', scoreLevel);

  function scoreLevel() {
    var directive = {
      restrict: 'A',
      replace: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.scoreLevel, function (level) {
        var l = 'L' + (level ? level : 0);
        l = '<kbd>' + l + '</kbd>';

        element.addClass('score-level');
        element.html(l);
      });
    }
  }
}());
