(function () {
  'use strict';

  angular
    .module('users')
    .controller('StatusController', StatusController);

  StatusController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'UsersService', 'ScoreLevelService', 'MeanTorrentConfig', 'ModalConfirmService',
    'NotifycationService', 'moment', 'localStorageService', 'MedalsService', 'MedalsInfoServices'];

  function StatusController($scope, $state, $timeout, $translate, Authentication, UsersService, ScoreLevelService, MeanTorrentConfig, ModalConfirmService,
                            NotifycationService, moment, localStorageService, MedalsService, MedalsInfoServices) {
    var vm = this;
    vm.user = Authentication.user;
    vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;

    /**
     * initTopBackground
     */
    vm.initTopBackground = function () {
      var url = localStorageService.get('body_background_image') || vm.homeConfig.bodyBackgroundImage;
      $('.backdrop').css('backgroundImage', 'url("' + url + '")');
    };

    /**
     * getMyMedals
     */
    vm.getMyMedals = function () {
      MedalsService.query({
        userId: vm.user._id
      }, function (medals) {
        vm.userMedals = MedalsInfoServices.mergeMedalsProperty(medals);
      });
    };

    /**
     * unIdle
     */
    vm.unIdle = function () {
      var days = (moment(moment()) - moment(vm.user.last_idled) - vm.signConfig.idle.accountIdleForTime) / (60 * 60 * 1000 * 24);
      var daysScore = Math.floor(days) * vm.signConfig.idle.activeMoreScorePerDay;

      var level = vm.scoreLevelData.currLevel;
      var levelScore = level * vm.signConfig.idle.activeMoreScorePerLevel;

      var totalScore = vm.signConfig.idle.activeIdleAccountBasicScore + daysScore + levelScore;

      var modalOptions = {
        closeButtonText: $translate.instant('ACTIVE_IDLE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('ACTIVE_IDLE_CONFIRM_OK'),
        headerText: $translate.instant('ACTIVE_IDLE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('ACTIVE_IDLE_CONFIRM_BODY_TEXT'),
        bodyParams: $translate.instant('ACTIVE_IDLE_NEED_SCORE', {
          basicScore: vm.signConfig.idle.activeIdleAccountBasicScore,
          daysScore: daysScore,
          levelScore: levelScore,
          totalScore: totalScore
        })
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
