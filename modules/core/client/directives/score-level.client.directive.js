(function () {
  'use strict';

  angular.module('core')
    .directive('scoreLevel', scoreLevel);

  function scoreLevel() {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.scoreLevel, function (level) {
        var l = 'L' + attrs.scoreLevel;
        l = '<kbd>' + l + '</kbd>';

        element.addClass('score-level');
        element.html(l);
      });
    }
  }
}());
