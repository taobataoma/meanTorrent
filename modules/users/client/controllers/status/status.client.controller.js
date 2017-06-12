(function () {
  'use strict';

  angular
    .module('users')
    .controller('StatusController', StatusController);

  StatusController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'ScoreLevelService'];

  function StatusController($scope, $state, $translate, $timeout, Authentication, $window, ScoreLevelService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

  }
}());
