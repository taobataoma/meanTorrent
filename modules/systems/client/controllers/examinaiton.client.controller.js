(function () {
  'use strict';

  angular
    .module('systems')
    .controller('ExaminationController', ExaminationController);

  ExaminationController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'SystemsService', 'ModalConfirmService', 'NotifycationService', 'marked',
    'DebugConsoleService', 'MeanTorrentConfig'];

  function ExaminationController($scope, $state, $timeout, $translate, Authentication, SystemsService, ModalConfirmService, NotifycationService, marked,
                                 mtDebug, MeanTorrentConfig) {
    var vm = this;
    vm.user = Authentication.user;
    vm.examinationConfig = MeanTorrentConfig.meanTorrentConfig.examination;

    /**
     * initExaminationData
     */
    vm.initExaminationData = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('SYSTEMS.CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('SYSTEMS.INIT_EXAMINATION_CONFIRM_CONTINUE'),
        headerText: $translate.instant('SYSTEMS.INIT_EXAMINATION_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('SYSTEMS.INIT_EXAMINATION_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          SystemsService.initExaminationData(function (res) {
            console.log(res);
            NotifycationService.showSuccessNotify('SYSTEMS.INIT_EXAMINATION_SUCCESSFULLY');
          }, function (err) {
            NotifycationService.showErrorNotify(err.data.message, 'SYSTEMS.INIT_EXAMINATION_ERRORU');
          });
        });
    };

  }
}());
