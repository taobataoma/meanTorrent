(function () {
  'use strict';

  angular
    .module('requests')
    .controller('RequestsMyController', RequestsMyController);

  RequestsMyController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'Authentication', 'RequestsService', 'ScoreLevelService', 'MeanTorrentConfig', 'DebugConsoleService',
    'NotifycationService', 'uibButtonConfig', 'marked'];

  function RequestsMyController($scope, $rootScope, $state, $timeout, $translate, Authentication, RequestsService, ScoreLevelService, MeanTorrentConfig, mtDebug,
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
      vm.getMyRequests(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (callback) callback();
      });
    };

    /**
     * getMyRequests
     */
    vm.getMyRequests = function (p, callback) {
      vm.statusMsg = 'REQUESTS.STATUS_GETTING';

      RequestsService.get({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage,
        user_id: vm.user._id
      }, function (data) {
        vm.statusMsg = undefined;
        mtDebug.info(data);
        callback(data);
      }, function (res) {
        vm.statusMsg = 'REQUESTS.STATUS_GETTING_ERROR';
      });
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
     * isExpired
     * @returns {boolean}
     */
    vm.isExpired = function (r) {
      var exp = false;
      if (r) {
        exp = (r.createdAt + vm.requestsConfig.requestExpires) > Date.now() ? false : true;
      }

      return exp;
    }

  }
}());
