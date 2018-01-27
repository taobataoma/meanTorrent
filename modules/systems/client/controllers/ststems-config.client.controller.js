(function () {
  'use strict';

  angular
    .module('systems')
    .controller('SystemConfigController', SystemConfigController);

  SystemConfigController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'SystemsService', 'ModalConfirmService', 'NotifycationService', 'marked',
    'DebugConsoleService'];

  function SystemConfigController($scope, $state, $timeout, $translate, Authentication, SystemsService, ModalConfirmService, NotifycationService, marked,
                                  mtDebug) {
    var vm = this;
    vm.user = Authentication.user;
    vm.selectedFilename = 'null';

    vm.cmOption = {
      lineNumbers: true,
      mode: {name: 'javascript', json: true},
      tabSize: 2,
      onLoad: function (_cm) {
        /**
         * initConfigContent
         * @param value
         */
        vm.initConfigContent = function (value) {
          _cm.setOption('value', value);
          vm.contentChanged = false;
        };

        /**
         * onSelectedFileChanged
         */
        vm.onSelectedFileChanged = function () {
          if (vm.contentChanged) {
            var modalOptions = {
              closeButtonText: $translate.instant('SYSTEMS.CONFIG_CHANGED_CONFIRM_CANCEL'),
              actionButtonText: $translate.instant('SYSTEMS.CONFIG_CHANGED_CONFIRM_SAVE'),
              headerText: $translate.instant('SYSTEMS.CONFIG_CHANGED_HEADER_TEXT'),
              bodyText: $translate.instant('SYSTEMS.CONFIG_CHANGED_BODY_TEXT')
            };

            ModalConfirmService.showModal({}, modalOptions)
              .then(function (result) {
                vm.saveConfigFileContent(function () {
                  loadNewFile();
                });
              }, function (result) {
                loadNewFile();
              });

          } else {
            loadNewFile();
          }
        };

        function loadNewFile() {
          _cm.setOption('value', '');
          SystemsService.getSystemConfigContent({
            filename: vm.selectedFilename
          }, function (res) {
            vm.loadedFilename = vm.selectedFilename;
            vm.initConfigContent(res.configContent);
          });
        }

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
          closeButtonText: $translate.instant('SYSTEMS.CONFIG_CHANGED_CONFIRM_CANCEL'),
          actionButtonText: $translate.instant('SYSTEMS.CONFIG_CHANGED_CONFIRM_SAVE'),
          headerText: $translate.instant('SYSTEMS.CONFIG_CHANGED_HEADER_TEXT'),
          bodyText: $translate.instant('SYSTEMS.CONFIG_CHANGED_BODY_TEXT')
        };

        ModalConfirmService.showModal({}, modalOptions)
          .then(function (result) {
            vm.saveConfigFileContent();
          });
      }
    });

    /**
     * getDescConfig
     * @returns {*}
     */
    vm.getDescConfig = function () {
      var ts = $translate.instant('SYSTEMS.DESC_CONFIG');

      return marked(ts, {sanitize: true});
    };

    /**
     * getEnvConfigFiles
     */
    vm.getEnvConfigFiles = function () {
      SystemsService.getSystemEnvConfigFiles(function (res) {
        vm.envConfigFiles = res;
      });
    };

    /**
     * getTransConfigFiles
     */
    vm.getTransConfigFiles = function () {
      SystemsService.getSystemTransConfigFiles(function (res) {
        vm.transConfigFiles = res;
      });
    };

    /**
     * getAssetsConfigFiles
     */
    vm.getAssetsConfigFiles = function () {
      SystemsService.getSystemAssetsConfigFiles(function (res) {
        vm.assetsConfigFiles = res;
      });
    };

    /**
     * saveConfigFileContent
     */
    vm.saveConfigFileContent = function (callback) {
      mtDebug.info('save content to config file: ' + vm.loadedFilename);
      var sc = new SystemsService({
        filename: vm.loadedFilename,
        content: vm.systemConfigContentValue
      });
      sc.$setSystemConfigContent(function (res) {
        NotifycationService.showSuccessNotify('SYSTEMS.CONFIG_SAVE_SUCCESSFULLY');
        vm.contentChanged = false;
        if (callback)
          callback();
      });
    };
  }
}());
