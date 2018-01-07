(function () {
  'use strict';

  angular
    .module('users')
    .controller('UserFollowersController', UserFollowersController);

  UserFollowersController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'Authentication', 'UsersService', 'ScoreLevelService', 'MeanTorrentConfig', 'DebugConsoleService',
    'NotifycationService', 'userResolve'];

  function UserFollowersController($scope, $rootScope, $state, $timeout, $translate, Authentication, UsersService, ScoreLevelService, MeanTorrentConfig, mtDebug,
                                   NotifycationService, userResolve) {
    var vm = this;
    vm.me = Authentication.user;
    vm.user = userResolve;
    vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.followListPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.getUserFollowers(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items;

        if (callback) callback();
      });
    };

    /**
     * getUserFollowers
     */
    vm.getUserFollowers = function (p, callback) {
      vm.statusMsg = 'FOLLOW.STATUS_GETTING';

      UsersService.getUserFollowers({
        userId: vm.user._id,
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage
      })
        .then(onSuccess)
        .catch(onError);

      function onSuccess(data) {
        vm.statusMsg = undefined;
        mtDebug.info(data);
        callback(data);
      }

      function onError(data) {
        vm.statusMsg = 'FOLLOW.STATUS_GETTING_ERROR';
      }
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_follow_list');

      vm.figureOutItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
        }, 10);
      });
    };

    /**
     * followTo
     */
    vm.followTo = function (u) {
      UsersService.userFollowTo({
        userId: u._id
      }).then(onSuccess)
        .catch(onError);

      function onSuccess(response) {
        mtDebug.info(response);
        vm.me = Authentication.user = response;
        $rootScope.$broadcast('user-follow-changed', response);

        NotifycationService.showSuccessNotify('FOLLOW_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify($translate.instant(response.data.message, {name: u.displayName}), 'FOLLOW_ERROR');
      }
    };

    /**
     * unFollowTo
     */
    vm.unFollowTo = function (u) {
      UsersService.userUnfollowTo({
        userId: u._id
      }).then(onSuccess)
        .catch(onError);

      function onSuccess(response) {
        mtDebug.info(response);
        vm.me = Authentication.user = response;
        $rootScope.$broadcast('user-follow-changed', response);

        NotifycationService.showSuccessNotify('UNFOLLOW_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'UNFOLLOW_ERROR');
      }
    };

    /**
     * inMyFollowing
     * @returns {boolean}
     */
    vm.inMyFollowing = function (u) {
      return vm.me.following.indexOf(u._id) >= 0 ? true : false;
    };

    /**
     * isContextUserSelf
     * @returns {boolean}
     */
    vm.isContextUserSelf = function (u) {
      return vm.me.username === u.username;
    };

  }
}());
