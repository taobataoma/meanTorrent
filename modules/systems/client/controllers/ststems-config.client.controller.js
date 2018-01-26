(function () {
  'use strict';

  angular
    .module('systems')
    .controller('SystemConfigController', SystemConfigController);

  SystemConfigController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'SystemsService', 'ModalConfirmService', 'NotifycationService'];

  function SystemConfigController($scope, $state, $timeout, $translate, Authentication, SystemsService, ModalConfirmService, NotifycationService) {
    var vm = this;
    vm.user = Authentication.user;

    vm.cmOption = {
      lineNumbers: true,
      mode: {name: 'javascript', json: true},
      tabSize: 2,
      onLoad: function (_cm) {
        vm.initConfigContent = function (value) {
          _cm.setOption('value', value);
          vm.contentChanged = false;
        };

        _cm.on('change', function () {
          vm.contentChanged = true;
        });
      }
    };

    /**
     * remove side_overlay background
     */
    $scope.$on('$stateChangeStart', function () {
      if (vm.contentChanged) {
        var modalOptions = {
          closeButtonText: $translate.instant('SYSTEMS.CONFIG_BLUR_CONFIRM_CANCEL'),
          actionButtonText: $translate.instant('SYSTEMS.CONFIG_BLUR_CONFIRM_SAVE'),
          headerText: $translate.instant('SYSTEMS.CONFIG_BLUR_HEADER_TEXT'),
          bodyText: $translate.instant('SYSTEMS.CONFIG_BLUR_BODY_TEXT')
        };

        ModalConfirmService.showModal({}, modalOptions)
          .then(function (result) {
            vm.saveConfigContent();
          });
      }
    });

    /**
     * getConfigFile
     */
    vm.getConfigFile = function () {
      SystemsService.getSystemConfig(function (res) {
        vm.initConfigContent(res.configContent);
        // vm.systemConfigContent = res.configContent;
      }, function (err) {

      });
    };

    /**
     * saveConfigContent
     */
    vm.saveConfigContent = function () {
      var sc = new SystemsService({
        content: vm.systemConfigContent
      });
      sc.$setSystemConfig(function (res) {
        console.log(res);
        // NotifycationService.showSuccessNotify('SYSTEMS.CONFIG_SAVE_SUCCESSFULLY');
        // vm.contentChanged = false;
      });
    };
  }
}());
