(function () {
  'use strict';

  angular
    .module('users')
    .controller('FollowersController', FollowersController);

  FollowersController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'Authentication', 'UsersService', 'ScoreLevelService', 'MeanTorrentConfig', 'DebugConsoleService',
    'NotifycationService'];

  function FollowersController($scope, $rootScope, $state, $timeout, $translate, Authentication, UsersService, ScoreLevelService, MeanTorrentConfig, mtDebug,
                               NotifycationService) {
    var vm = this;
    vm.user = Authentication.user;
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
      vm.getMyFollowers(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items;

        if (callback) callback();
      });
    };

    /**
     * getMyFollowers
     */
    vm.getMyFollowers = function (p, callback) {
      vm.statusMsg = 'FOLLOW.STATUS_GETTING';

      UsersService.getMyFollowers({
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
        vm.user = Authentication.user = response;
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
        vm.user = Authentication.user = response;
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
      return vm.user.following.indexOf(u._id) >= 0 ? true : false;
    };

  }
}());
