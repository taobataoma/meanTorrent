(function () {
  'use strict';

  angular
    .module('users')
    .controller('UserInfoController', UserInfoController);

  UserInfoController.$inject = ['$scope', '$state', 'Authentication', 'userResolve', 'ScoreLevelService'];

  function UserInfoController($scope, $state, Authentication, user, ScoreLevelService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = user;
    vm.messageTo = messageTo;
    vm.isContextUserSelf = isContextUserSelf;
    vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);

    /**
     * messageTo
     */
    function messageTo() {
      var to = vm.user._id + '|' + vm.user.username;
      $state.go('messages.send', {to: to});
    }

    /**
     * isContextUserSelf
     * @returns {boolean}
     */
    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
  }
}());
