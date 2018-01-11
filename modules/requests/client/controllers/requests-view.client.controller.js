(function () {
  'use strict';

  angular
    .module('requests')
    .controller('RequestsViewController', RequestsViewController);

  RequestsViewController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'Authentication', 'RequestsService', 'ScoreLevelService', 'MeanTorrentConfig', 'DebugConsoleService',
    'NotifycationService', 'uibButtonConfig', 'marked'];

  function RequestsViewController($scope, $rootScope, $state, $timeout, $translate, Authentication, RequestsService, ScoreLevelService, MeanTorrentConfig, mtDebug,
                                 NotifycationService, uibButtonConfig, marked) {
    var vm = this;
    vm.user = Authentication.user;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.requestsConfig = MeanTorrentConfig.meanTorrentConfig.requests;

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
     * getRequestItemDescContent
     * @param q
     * @returns {*}
     */
    vm.getRequestItemDescContent = function (q) {
      return q ? marked(q.desc, {sanitize: true}) : '';
    };
  }
}());
