(function () {
  'use strict';

  angular
    .module('users.services')
    .factory('ScoreLevelService', ScoreLevelService);

  ScoreLevelService.$inject = ['MeanTorrentConfig'];

  function ScoreLevelService(MeanTorrentConfig) {
    var scoreConfig = MeanTorrentConfig.meanTorrentConfig.score;
    var step = scoreConfig.levelStep;

    return {
      getScoreLevelJson: function (score) {
        var levelJson = {};
        var l = Math.floor(Math.sqrt(score / step));
        levelJson.score = score;

        levelJson.prevLevel = (l - 1) <= 0 ? 0 : l - 1;
        levelJson.currLevel = l;
        levelJson.nextLevel = l + 1;

        levelJson.prevLevelValue = levelJson.prevLevel * levelJson.prevLevel * step;
        levelJson.currLevelValue = levelJson.currLevel * levelJson.currLevel * step;
        levelJson.nextLevelValue = levelJson.nextLevel * levelJson.nextLevel * step;
        levelJson.currPercent = Math.ceil((score - levelJson.currLevelValue) / (levelJson.nextLevelValue - levelJson.currLevelValue) * 10000) / 100;
        levelJson.currPercentString = levelJson.currPercent + '%';

        return levelJson;
      }
    };
  }
}());
