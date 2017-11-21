(function () {
  'use strict';

  angular.module('core')
    .directive('scoreLevel', scoreLevel);

  scoreLevel.$reject = ['ScoreLevelService'];

  function scoreLevel(ScoreLevelService) {
    var directive = {
      restrict: 'A',
      replace: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.scoreLevel, function (u) {
        if (u) {
          console.log(u);
          var scoreLevelData = ScoreLevelService.getScoreLevelJson(u.score);

          var l = 'L' + (scoreLevelData ? scoreLevelData.currLevel : 0);
          l = '<kbd>' + l + '</kbd>';

          element.addClass('score-level');
          element.html(l);
        }
      });
    }
  }
}());
