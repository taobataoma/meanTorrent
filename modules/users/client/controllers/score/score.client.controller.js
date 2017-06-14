(function () {
  'use strict';

  angular
    .module('users')
    .controller('ScoreController', ScoreController);

  ScoreController.$inject = ['$rootScope', '$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'ScoreLevelService', 'getStorageLangService',
    'MeanTorrentConfig', 'ModalConfirmService', 'NotifycationService', 'InvitationsService'];

  function ScoreController($rootScope, $scope, $state, $translate, $timeout, Authentication, $window, ScoreLevelService, getStorageLangService, MeanTorrentConfig,
                           ModalConfirmService, NotifycationService, InvitationsService) {
    var vm = this;
    vm.scoreConfig = MeanTorrentConfig.meanTorrentConfig.score;
    vm.inviteConfig = MeanTorrentConfig.meanTorrentConfig.invite;
    vm.lang = getStorageLangService.getLang();
    vm.user = Authentication.user;

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    $scope.$on('auth-user-changed', function(event, args) {
      vm.user = Authentication.user;
      vm.scoreLevelData = vm.user ? ScoreLevelService.getScoreLevelJson(vm.user.score) : undefined;
    });

    /**
     * init
     */
    vm.init = function () {
      vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);
    };

    /**
     * exchangeInvitation
     */
    vm.exchangeInvitation = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('EXCHANGE_INVITATION_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('EXCHANGE_INVITATION_CONFIRM_OK'),
        headerText: $translate.instant('EXCHANGE_INVITATION_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('EXCHANGE_INVITATION_CONFIRM_BODY_TEXT', {score: vm.inviteConfig.score_exchange})
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          var invitation = new InvitationsService();

          invitation.$save(function (response) {
            successCallback(response);
          }, function (errorResponse) {
            errorCallback(errorResponse);
          });

          function successCallback(res) {
            if (res._id === vm.user._id) {
              vm.user = Authentication.user = res;
              $rootScope.$broadcast('auth-user-changed');
            }
            NotifycationService.showSuccessNotify('EXCHANGE_INVITATION_SUCCESSFULLY');
          }

          function errorCallback(res) {
            NotifycationService.showErrorNotify(res.data.message, 'EXCHANGE_INVITATION_ERROR');
          }
        });
    };
  }
}());
