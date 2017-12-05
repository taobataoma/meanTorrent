(function () {
  'use strict';

  angular
    .module('users')
    .controller('StatusController', StatusController);

  StatusController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'UsersService', 'ScoreLevelService', 'MeanTorrentConfig', 'ModalConfirmService',
    'NotifycationService'];

  function StatusController($scope, $state, $timeout, $translate, Authentication, UsersService, ScoreLevelService, MeanTorrentConfig, ModalConfirmService,
                            NotifycationService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;

    /**
     * unIdle
     */
    vm.unIdle = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('ACTIVE_IDLE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('ACTIVE_IDLE_CONFIRM_OK'),
        headerText: $translate.instant('ACTIVE_IDLE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('ACTIVE_IDLE_CONFIRM_BODY_TEXT', {score: vm.signConfig.activeIdleAccountScore})
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          UsersService.userUnIdle()
            .then(onSuccess)
            .catch(onError);

          function onSuccess(response) {
            vm.user = Authentication.user = response;

            NotifycationService.showSuccessNotify('ACTIVE_IDLE_SUCCESSFULLY');
            $timeout(function () {
              $state.go('home');
            }, 100);
          }

          function onError(response) {
            NotifycationService.showErrorNotify(response.data.message, 'ACTIVE_IDLE_ERROR');
          }
        });
    };
  }
}());
