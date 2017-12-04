(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsViewController', ForumsViewController);

  ForumsViewController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'moment', '$filter', 'NotifycationService',
    '$timeout', 'localStorageService', '$stateParams', 'TopicsService', 'DebugConsoleService'];

  function ForumsViewController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, moment, $filter, NotifycationService,
                                $timeout, localStorageService, $stateParams, TopicsService, mtDebug) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.user = Authentication.user;
    vm.forumPath = [];

    /**
     * buildPager
     * pagination init
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.topicsPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.getTopicsList(vm.currentPage, function (items) {
        mtDebug.info(items);
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (callback) callback();
      });
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_post_list');

      vm.figureOutItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
        }, 10);
      });
    };

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
        vm.buildPager();
        // get global topics list
        TopicsService.getGlobalTopics(function (topics) {
          mtDebug.info(topics);
          vm.globalTopics = topics;
        });
      }, function (res) {
        if (typeof res.data.redirect == 'string') {
          $state.go(res.data.redirect);
        }
      });
    };

    /**
     * getTopicsList
     * @param p
     * @param callback
     */
    vm.getTopicsList = function (p, callback) {
      TopicsService.get({
        forumId: $stateParams.forumId,
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage
      }, function (items) {
        callback(items);
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

    /**
     * hasAttach
     * @param t
     * @returns {boolean}
     */
    vm.hasAttach = function (t) {
      var has = false;
      if (t._attach.length > 0) {
        has = true;
      } else {
        angular.forEach(t._replies, function (r) {
          if (r._attach.length > 0) {
            has = true;
          }
        });
      }
      return has;
    };
  }
}());
