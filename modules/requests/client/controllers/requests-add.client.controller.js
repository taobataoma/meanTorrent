(function () {
  'use strict';

  angular
    .module('requests')
    .controller('RequestsAddController', RequestsAddController);

  RequestsAddController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'Authentication', 'RequestsService', 'ScoreLevelService', 'MeanTorrentConfig', 'DebugConsoleService',
    'NotifycationService', 'marked'];

  function RequestsAddController($scope, $rootScope, $state, $timeout, $translate, Authentication, RequestsService, ScoreLevelService, MeanTorrentConfig, mtDebug,
                                 NotifycationService, marked) {
    var vm = this;
    vm.user = Authentication.user;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.requestsConfig = MeanTorrentConfig.meanTorrentConfig.requests;
    vm.torrentTypeConfig = MeanTorrentConfig.meanTorrentConfig.torrentType;

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
  }
}());
