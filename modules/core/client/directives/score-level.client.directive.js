(function () {
  'use strict';

  angular.module('core')
    .directive('scoreLevelCurr', scoreLevelCurr);

  scoreLevelCurr.$reject = ['ScoreLevelService'];

  function scoreLevelCurr(ScoreLevelService) {
    var directive = {
      restrict: 'A',
      replace: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.scoreLevelCurr, function (u) {
        if (u) {
          var scoreLevelData = ScoreLevelService.getScoreLevelJson(u.score);

          var l = 'L' + (scoreLevelData ? scoreLevelData.currLevel : 0);
          l = '<kbd>' + l + '</kbd>';

          element.addClass('score-level');
          element.html(l);
        }
      });
    }
  }

  angular.module('core')
    .directive('scoreLevelNext', scoreLevelNext);

  scoreLevelNext.$reject = ['ScoreLevelService'];

  function scoreLevelNext(ScoreLevelService) {
    var directive = {
      restrict: 'A',
      replace: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.scoreLevelNext, function (u) {
        if (u) {
          var scoreLevelData = ScoreLevelService.getScoreLevelJson(u.score);

          var l = 'L' + (scoreLevelData ? scoreLevelData.nextLevel : 0);
          l = '<kbd>' + l + '</kbd>';

          element.addClass('score-level');
          element.html(l);
        }
      });
    }
  }
}());
