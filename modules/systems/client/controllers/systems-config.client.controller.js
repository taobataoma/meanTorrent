(function () {
  'use strict';

  angular
    .module('systems')
    .controller('SystemConfigController', SystemConfigController);

  SystemConfigController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'SystemsService', 'ModalConfirmService', 'NotifycationService', 'marked',
    'DebugConsoleService', 'MeanTorrentConfig', '$filter'];

  function SystemConfigController($scope, $state, $timeout, $translate, Authentication, SystemsService, ModalConfirmService, NotifycationService, marked,
                                  mtDebug, MeanTorrentConfig, $filter) {
    var vm = this;
    vm.user = Authentication.user;
    vm.selectedFilename = 'null';
    vm.shellCommandConfig = MeanTorrentConfig.meanTorrentConfig.shellCommand;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.scoreConfig = MeanTorrentConfig.meanTorrentConfig.score;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.rssConfig = MeanTorrentConfig.meanTorrentConfig.rss;
    vm.ircConfig = MeanTorrentConfig.meanTorrentConfig.ircAnnounce;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.inviteConfig = MeanTorrentConfig.meanTorrentConfig.invite;
    vm.requestsConfig = MeanTorrentConfig.meanTorrentConfig.requests;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.salesTypeConfig = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
    vm.salesGlobalConfig = MeanTorrentConfig.meanTorrentConfig.torrentGlobalSales;
    vm.ircAnnounceConfig = MeanTorrentConfig.meanTorrentConfig.ircAnnounce;
    vm.passwordConfig = MeanTorrentConfig.meanTorrentConfig.password;
    vm.examinationConfig = MeanTorrentConfig.meanTorrentConfig.examination;
    vm.chatConfig = MeanTorrentConfig.meanTorrentConfig.chat;

    /**
     * cmOption
     * @type {{lineNumbers: boolean, tabSize: number, onLoad: SystemConfigController.cmOption.onLoad}}
     */
    vm.cmOption = {
      onLoad: function (_cm) {
        _cm.setOption('lineNumbers', true);
        _cm.setOption('tabSize', 2);
        _cm.setOption('gutters', ['CodeMirror-lint-markers', 'CodeMirror-linenumbers']);
        _cm.setOption('lint', true);
        /**
         * initConfigContent
         * @param value
         */
        vm.initConfigContent = function (value) {
          _cm.setOption('value', value);
          vm.contentChanged = false;
          vm.showFooter = true;
          vm.showBody = true;
          vm.showLoading = false;
          $timeout(function () {
            _cm.refresh();
          }, 100);
        };

        /**
         * onSelectedFileChanged
         */
        vm.onSelectedFileChanged = function () {
          if (vm.contentChanged) {
            var modalOptions = {
              closeButtonText: $translate.instant('SYSTEMS.CONFIRM_CANCEL'),
              actionButtonText: $translate.instant('SYSTEMS.CONFIG_CHANGED_CONFIRM_SAVE'),
              headerText: $translate.instant('SYSTEMS.CONFIG_CHANGED_CONFIRM_HEADER_TEXT'),
              bodyText: $translate.instant('SYSTEMS.CONFIG_CHANGED_CONFIRM_BODY_TEXT')
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
          vm.showFooter = false;
          vm.showBody = false;
          vm.showLoading = true;

          SystemsService.getSystemConfigContent({
            filename: vm.selectedFilename
          }, function (res) {
            var ext = vm.selectedFilename.split('.').pop();
            switch (ext) {
              case 'md':
                _cm.setOption('mode', 'markdown');
                _cm.setOption('lineWrapping', true);
                break;
              case 'html':
                _cm.setOption('mode', 'xml');
                _cm.setOption('htmlMode', true);
                _cm.setOption('lineWrapping', true);
                break;
              default:
                _cm.setOption('mode', {name: 'javascript', json: true});
                _cm.setOption('lineWrapping', false);
            }

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
     * cmdOption
     * @type {{lineNumbers: boolean, tabSize: number, readOnly: boolean, onLoad: SystemConfigController.cmdOption.onLoad}}
     */
    vm.cmdOption = {
      onLoad: function (_cm) {
        _cm.setOption('lineNumbers', true);
        _cm.setOption('lineWrapping', true);
        _cm.setOption('tabSize', 2);
        _cm.setOption('readOnly', true);

        $('.CodeMirror').css('height', '0');

        /**
         * initCommandContent
         * @param value
         */
        vm.initCommandContent = function (value) {
          _cm.setOption('value', value);
          $timeout(function () {
            _cm.refresh();
          }, 100);
        };
      }
    };

    /**
     * remove side_overlay background
     */
    $scope.$on('$stateChangeStart', function () {
      if (vm.contentChanged) {
        var modalOptions = {
          closeButtonText: $translate.instant('SYSTEMS.CONFIRM_CANCEL'),
          actionButtonText: $translate.instant('SYSTEMS.CONFIG_CHANGED_CONFIRM_SAVE'),
          headerText: $translate.instant('SYSTEMS.CONFIG_CHANGED_CONFIRM_HEADER_TEXT'),
          bodyText: $translate.instant('SYSTEMS.CONFIG_CHANGED_CONFIRM_BODY_TEXT')
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
     * getDescCommand
     * @returns {*}
     */
    vm.getDescCommand = function () {
      var ts = $translate.instant('SYSTEMS.DESC_COMMAND');

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
     * getTemplateFrontConfigFiles
     */
    vm.getTemplateFrontConfigFiles = function () {
      SystemsService.getSystemTemplateFrontConfigFiles(function (res) {
        vm.templateFrontConfigFiles = res;
      });
    };

    /**
     * getTemplateBackConfigFiles
     */
    vm.getTemplateBackConfigFiles = function () {
      SystemsService.getSystemTemplateBackConfigFiles(function (res) {
        vm.templateBackConfigFiles = res;
      });
    };

    /**
     * getMarkedConfigContent
     * @returns {*}
     */
    vm.getMarkedConfigContent = function () {
      var tmp = $filter('fmt')(vm.systemConfigContentValue, {
        appConfig: vm.appConfig,
        announceConfig: vm.announce,
        scoreConfig: vm.scoreConfig,
        rssConfig: vm.rssConfig,
        ircConfig: vm.ircConfig,
        signConfig: vm.signConfig,
        inviteConfig: vm.inviteConfig,
        requestsConfig: vm.requestsConfig,
        hnrConfig: vm.hnrConfig,
        tmdbConfig: vm.tmdbConfig,
        salesTypeConfig: vm.salesTypeConfig,
        salesGlobalConfig: vm.salesGlobalConfig,
        ircAnnounceConfig: vm.ircAnnounceConfig,
        passwordConfig: vm.passwordConfig,
        examinationConfig: vm.examinationConfig,
        chatConfig: vm.chatConfig,

        user: vm.user
      });
      return marked(tmp, {sanitize: false});
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

    /**
     * commandKeydown
     * @param evt
     */
    vm.commandKeydown = function (evt) {
      if (evt.keyCode === 13) {
        vm.runCommand(vm.customCommand, 'command-custom');
      }
    };

    /**
     * runCommand
     * @param cmd
     */
    vm.runCommand = function (cmd, eid) {
      if (cmd) {
        vm.shellIsRunning = true;
        vm.runningId = eid;

        $('.CodeMirror').css('height', '0');
        $('.CodeMirror').css('border', 'none');
        $('.CodeMirror').css('margin-top', '0');

        SystemsService.shellCommand({
          command: cmd
        }, function (res) {
          showCommandStdout(res);
        }, function (err) {
          showCommandStdout(err);
        });
      }

      function showCommandStdout(res) {
        console.log(res);
        vm.shellIsRunning = false;

        var stdoutElement = $('#stdout-message');
        if (stdoutElement) {
          stdoutElement.remove();
        }

        var outString = 'COMMAND: ' + cmd;
        outString += '\nCODE: ' + res.code;
        outString += '\nSTDOUT:\n---------------------------------\n' + (res.stdout || 'null');
        outString += '\nSTDERR:\n---------------------------------\n' + (res.stderr || 'null');

        var element = $('.CodeMirror');
        $('#' + eid).append(element);
        $('.CodeMirror').css('height', '300px');
        $('.CodeMirror').css('border', 'solid 1px #ddd');
        $('.CodeMirror').css('margin-top', '10px');
        $('.CodeMirror').css('background-color', '#fafbfc');

        vm.initCommandContent(outString);
      }
    };

    vm.getCurrExaminationConfig = function () {
      return JSON.stringify(vm.examinationConfig);
    };
  }
}());
