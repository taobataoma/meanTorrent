(function () {
  'use strict';

  angular
    .module('users.services')
    .factory('ScoreLevelService', ScoreLevelService);

  ScoreLevelService.$inject = ['$window'];

  function ScoreLevelService($window) {
    return {
      getScoreLevelJson: function (score) {
        var levelJson = {};
        var l = Math.floor(Math.sqrt(score / 500));
        levelJson.score = score;

        levelJson.prevLevel = (l - 1) <= 0 ? 0 : l - 1;
        levelJson.currLevel = l;
        levelJson.nextLevel = l + 1;

        levelJson.prevLevelValue = levelJson.prevLevel * levelJson.prevLevel * 500;
        levelJson.currLevelValue = levelJson.currLevel * levelJson.currLevel * 500;
        levelJson.nextLevelValue = levelJson.nextLevel * levelJson.nextLevel * 500;
        levelJson.currPercent = (score - levelJson.currLevelValue) / (levelJson.nextLevelValue - levelJson.currLevelValue) * 100;

        return levelJson;
      }
    };
  }
}());
