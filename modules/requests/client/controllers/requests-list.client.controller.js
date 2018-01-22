(function () {
  'use strict';

  angular
    .module('requests')
    .controller('RequestsListController', RequestsListController);

  RequestsListController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'Authentication', 'RequestsService', 'ScoreLevelService', 'MeanTorrentConfig', 'DebugConsoleService',
    'NotifycationService', 'uibButtonConfig', 'marked', 'localStorageService'];

  function RequestsListController($scope, $rootScope, $state, $timeout, $translate, Authentication, RequestsService, ScoreLevelService, MeanTorrentConfig, mtDebug,
                                 NotifycationService, uibButtonConfig, marked, localStorageService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.requestsConfig = MeanTorrentConfig.meanTorrentConfig.requests;
    vm.show_desc_help = localStorageService.get('requests_list_show_help') || 'yes';

    /**
     * getRequestsDesc
     * @returns {*}
     */
    vm.getRequestsDesc = function () {
      var ts = $translate.instant('REQUESTS.DESC_LIST', {
        days: vm.requestsConfig.requestExpires / (60 * 60 * 1000 * 24)
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
        vm.pagedItems = items.rows;

        if (callback) callback();
      });
    };

    /**
     * getRequests
     */
    vm.getRequests = function (p, callback) {
      vm.statusMsg = 'REQUESTS.STATUS_GETTING';

      RequestsService.get({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage
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
        exp = ((moment(r.createdAt) + vm.requestsConfig.requestExpires) > moment(Date.now())) ? false : true;
      }

      return exp;
    };

    /**
     * onShowHelpClicked
     */
    vm.onShowHelpClicked = function () {
      var e = $('.requests-desc');

      if (e.hasClass('panel-collapsed')) {
        e.slideDown();
        e.removeClass('panel-collapsed');
        localStorageService.set('requests_list_show_help', 'yes');
      } else {
        e.slideUp();
        e.addClass('panel-collapsed');
        localStorageService.set('requests_list_show_help', 'no');
      }
    };

    /**
     * onCloseHelpClicked
     */
    vm.onCloseHelpClicked = function () {
      var e = $('.requests-desc');

      if (!e.hasClass('panel-collapsed')) {
        e.slideUp();
        e.addClass('panel-collapsed');
        localStorageService.set('requests_list_show_help', 'no');
      }
    };
  }
}());
