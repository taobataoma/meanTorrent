(function () {
  'use strict';

  angular
    .module('users')
    .controller('StatusController', StatusController);

  StatusController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'ScoreLevelService', 'MeanTorrentConfig'];

  function StatusController($scope, $state, $translate, $timeout, Authentication, $window, ScoreLevelService, MeanTorrentConfig) {
    var vm = this;
    vm.user = Authentication.user;
    vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

  }
}());
