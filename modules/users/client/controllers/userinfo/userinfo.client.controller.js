(function () {
  'use strict';

  angular
    .module('users')
    .controller('UserInfoController', UserInfoController);

  UserInfoController.$inject = ['$scope', '$rootScope', '$state', 'Authentication', 'userResolve', 'ScoreLevelService', '$timeout', 'MeanTorrentConfig', 'UsersService',
    'DebugConsoleService', 'NotifycationService'];

  function UserInfoController($scope, $rootScope, $state, Authentication, user, ScoreLevelService, $timeout, MeanTorrentConfig, UsersService,
                              mtDebug, NotifycationService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.user = user;
    vm.messageTo = messageTo;
    vm.isContextUserSelf = isContextUserSelf;
    vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);

    mtDebug.info(user);

    /**
     * messageTo
     */
    function messageTo() {
      var to = vm.user._id + '|' + vm.user.displayName;
      $state.go('messages.send', {to: to});
    }

    /**
     * isContextUserSelf
     * @returns {boolean}
     */
    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }

    /**
     * inMyFollowing
     * @returns {boolean}
     */
    vm.inMyFollowing = function () {
      return vm.authentication.user.following.indexOf(vm.user._id) >= 0 ? true : false;
    };

    /**
     * followTo
     */
    vm.followTo = function () {
      UsersService.userFollowTo({
        userId: vm.user._id
      }).then(onSuccess)
        .catch(onError);

      function onSuccess(response) {
        mtDebug.info(response);
        vm.authentication.user = Authentication.user = response;
        $rootScope.$broadcast('user-follow-changed', response);

        NotifycationService.showSuccessNotify('FOLLOW_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'FOLLOW_ERROR');
      }
    };

    /**
     * unFollowTo
     */
    vm.unFollowTo = function () {
      UsersService.userUnfollowTo({
        userId: vm.user._id
      }).then(onSuccess)
        .catch(onError);

      function onSuccess(response) {
        mtDebug.info(response);
        vm.authentication.user = Authentication.user = response;
        $rootScope.$broadcast('user-follow-changed', response);

        NotifycationService.showSuccessNotify('UNFOLLOW_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'UNFOLLOW_ERROR');
      }
    };
  }
}());
