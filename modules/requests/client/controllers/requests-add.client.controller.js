(function () {
  'use strict';

  angular
    .module('requests')
    .controller('RequestsAddController', RequestsAddController);

  RequestsAddController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'Authentication', 'RequestsService', 'ScoreLevelService', 'MeanTorrentConfig', 'DebugConsoleService',
    'NotifycationService', 'marked', 'localStorageService'];

  function RequestsAddController($scope, $rootScope, $state, $timeout, $translate, Authentication, RequestsService, ScoreLevelService, MeanTorrentConfig, mtDebug,
                                 NotifycationService, marked, localStorageService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.requestsConfig = MeanTorrentConfig.meanTorrentConfig.requests;
    vm.torrentTypeConfig = MeanTorrentConfig.meanTorrentConfig.torrentType;
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;
    vm.show_desc_help = localStorageService.get('requests_add_show_help') || 'yes';

    vm.request = {
      type: 'movie',
      rewards: vm.requestsConfig.rewardsFormDefaultValue
    };

    /**
     * getRequestsDesc
     * @returns {*}
     */
    vm.getRequestsDesc = function () {
      var ts = $translate.instant('REQUESTS.DESC_ADD', {
        days: vm.requestsConfig.requestExpires / (60 * 60 * 1000 * 24),
        add_score: vm.requestsConfig.scoreForAddRequest
      });

      return marked(ts, {sanitize: true});
    };

    /**
     * create
     * @param isValid
     * @returns {boolean}
     */
    vm.create = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.requestForm');
        return false;
      }

      var request = new RequestsService(vm.request);

      mtDebug.info(request);
      request.$save(function (response) {
        success(response);
      }, function (errorResponse) {
        error(errorResponse);
      });

      function success(res) {
        NotifycationService.showSuccessNotify('REQUESTS.POST_REQUEST_SUCCESSFULLY');
        $state.go('requests.my');
      }

      function error(res) {
        NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.POST_REQUEST_FAILED');
      }
    };

    /**
     * onShowHelpClicked
     */
    vm.onShowHelpClicked = function () {
      var e = $('.requests-desc');

      if (e.hasClass('panel-collapsed')) {
        e.slideDown();
        e.removeClass('panel-collapsed');
        localStorageService.set('requests_add_show_help', 'yes');
      } else {
        e.slideUp();
        e.addClass('panel-collapsed');
        localStorageService.set('requests_add_show_help', 'no');
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
        localStorageService.set('requests_add_show_help', 'no');
      }
    };
  }
}());
