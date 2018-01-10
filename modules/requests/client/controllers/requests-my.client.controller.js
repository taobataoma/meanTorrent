(function () {
  'use strict';

  angular
    .module('requests')
    .controller('RequestsMyController', RequestsMyController);

  RequestsMyController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'Authentication', 'UsersService', 'ScoreLevelService', 'MeanTorrentConfig', 'DebugConsoleService',
    'NotifycationService', 'uibButtonConfig', 'marked'];

  function RequestsMyController($scope, $rootScope, $state, $timeout, $translate, Authentication, UsersService, ScoreLevelService, MeanTorrentConfig, mtDebug,
                                NotifycationService, uibButtonConfig, marked) {
    var vm = this;
    vm.user = Authentication.user;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.requestsConfig = MeanTorrentConfig.meanTorrentConfig.requests;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;

    /**
     * getRequestsDesc
     * @returns {*}
     */
    vm.getRequestsDesc = function () {
      var ts = $translate.instant('REQUESTS.DESC_MY', {
        days: vm.requestsConfig.requestExpires / (60 * 60 * 1000 * 24),
        admin: vm.announceConfig.admin
      });

      return marked(ts, {sanitize: true});
    };

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.requestListPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.getRequests(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items;

        if (callback) callback();
      });
    };

    /**
     * getRequests
     */
    vm.getRequests = function (p, callback) {
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

  }
}());
