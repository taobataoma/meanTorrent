(function () {
  'use strict';

  angular
    .module('users')
    .controller('ScoreController', ScoreController);

  ScoreController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'ScoreLevelService'];

  function ScoreController($scope, $state, $translate, $timeout, Authentication, $window, ScoreLevelService) {
    var vm = this;
    vm.user = Authentication.user;

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * init
     */
    vm.init = function () {
      vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);

      console.log(vm.scoreLevelData);
    };
  }
}());
