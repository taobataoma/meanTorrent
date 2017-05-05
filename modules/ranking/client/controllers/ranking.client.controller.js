(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('RankingController', RankingController);

  RankingController.$inject = ['$scope', 'RankingService', '$translate', 'localStorageService'];

  function RankingController($scope, RankingService, $translate, localStorageService) {
    var vm = this;

    vm.rankingTabs = [
      {title: $translate.instant('PAGE_HEADER_RANKING_UPLOAD'), templateUrl: 'upload_ranking.html'},
      {title: $translate.instant('PAGE_HEADER_RANKING_DOWNLOAD'), templateUrl: 'download_ranking.html'},
      {title: $translate.instant('PAGE_HEADER_RANKING_RATIO'), templateUrl: 'ratio_ranking.html'},
      {title: $translate.instant('PAGE_HEADER_RANKING_SCORE'), templateUrl: 'score_ranking.html'}
    ];

    vm.getRankingList = function () {
      RankingService.get(function (data) {
        console.log(data);

        vm.upload_ranking = data.upload_ranking;
        vm.download_ranking = data.download_ranking;
        vm.ratio_ranking = data.ratio_ranking;
        vm.score_ranking = data.score_ranking;
      });
    };
  }
}());
