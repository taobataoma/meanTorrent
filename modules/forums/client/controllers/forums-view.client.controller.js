(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsViewController', ForumsViewController);

  ForumsViewController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'moment', '$filter', 'NotifycationService',
    'marked', 'localStorageService', '$stateParams', 'TopicsService'];

  function ForumsViewController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, moment, $filter, NotifycationService,
                                marked, localStorageService, $stateParams, TopicsService) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;
    vm.forumPath = [];

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
      vm.last_leave_time = localStorageService.get('last_leave_time') || Date.now();

      // get forum info by state params
      ForumsService.get({
        forumId: $stateParams.forumId
      }, function (item) {
        vm.forum = item;

        vm.forumPath.push({name: vm.forum.name, state: undefined});
      });

      // get global topics list
      TopicsService.getGlobalTopics(function (topics) {
        console.log(topics);
        vm.globalTopics = topics;
      });

      // get topics list
      TopicsService.query({
        forumId: $stateParams.forumId
      }, function (topics) {
        console.log(topics);
        vm.topics = topics;
      });

    };

    /**
     * isModerator
     * @param f
     * @returns {boolean}
     */
    vm.isModerator = function (f) {
      var isM = false;

      if (f) {
        angular.forEach(f.moderators, function (m) {
          if (m._id === vm.user._id) {
            isM = true;
          }
        });
      }

      return isM;
    };

    /**
     * canEditTopic
     * @param f
     * @returns {boolean}
     */
    vm.canEdit = function (f) {
      if (f) {
        if (vm.isModerator(f) || vm.user.isOper) {
          return true;
        } else {
          return false;
        }
      }
    };

    /**
     * hasNewReply
     * @param t
     * @returns {boolean}
     */
    vm.hasNewReply = function (t) {
      if (t && t.lastReplyAt) {
        var t_reply = moment.utc(t.lastReplyAt).valueOf();
        var t_leave = moment.utc(vm.last_leave_time).valueOf();

        return t_reply > t_leave;
      } else {
        return false;
      }
    };
  }
}());
