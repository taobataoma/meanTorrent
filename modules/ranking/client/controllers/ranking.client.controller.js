(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('RankingController', RankingController);

  RankingController.$inject = ['$scope', 'RankingService', '$translate', 'localStorageService', 'MeanTorrentConfig', 'DebugConsoleService'];

  function RankingController($scope, RankingService, $translate, localStorageService, MeanTorrentConfig, mtDebug) {
    var vm = this;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;

    vm.rankingTabs = [
      {
        icon: 'fa-line-chart',
        title: $translate.instant('PAGE_HEADER_RANKING_SCORE'),
        templateUrl: 'score_ranking.html',
        ng_show: true
      },
      {
        icon: 'fa-arrow-up',
        title: $translate.instant('PAGE_HEADER_RANKING_UPLOAD'),
        templateUrl: 'upload_ranking.html',
        ng_show: true
      },
      {
        icon: 'fa-arrow-down',
        title: $translate.instant('PAGE_HEADER_RANKING_DOWNLOAD'),
        templateUrl: 'download_ranking.html',
        ng_show: true
      },
      {
        icon: 'fa-exchange',
        title: $translate.instant('PAGE_HEADER_RANKING_RATIO'),
        templateUrl: 'ratio_ranking.html',
        ng_show: true
      }
    ];

    vm.getRankingList = function () {
      RankingService.get(function (data) {
        mtDebug.info(data);

        vm.upload_ranking = data.upload_ranking;
        vm.download_ranking = data.download_ranking;
        vm.ratio_ranking = data.ratio_ranking;
        vm.score_ranking = data.score_ranking;
      });
    };
  }
}());
