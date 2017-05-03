(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('RankingController', RankingController);

  RankingController.$inject = ['$scope', 'RankingService'];

  function RankingController($scope, RankingService) {
    var vm = this;

    RankingService.get(function (data) {
      console.log(data);

      vm.upload_ranking = data.upload_ranking;
      vm.download_ranking = data.download_ranking;
      vm.ratio_ranking = data.ratio_ranking;
      vm.score_ranking = data.score_ranking;
    });
  }
}());
