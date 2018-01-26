(function () {
  'use strict';

  angular
    .module('systems')
    .controller('SystemConfigController', SystemConfigController);

  SystemConfigController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'SystemsService'];

  function SystemConfigController($scope, $state, $timeout, $translate, Authentication, SystemsService) {
    var vm = this;
    vm.user = Authentication.user;

    /**
     * getConfigFile
     */
    vm.getConfigFile = function () {
      SystemsService.getSystemConfig(function (res) {
        vm.systemConfigContent = res.configContent;
      }, function (err) {

      });
    };
  }
}());
