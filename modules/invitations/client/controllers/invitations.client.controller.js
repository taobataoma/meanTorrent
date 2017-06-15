(function () {
  'use strict';

  angular
    .module('invitations')
    .controller('InviteController', InviteController);

  InviteController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'MeanTorrentConfig', 'NotifycationService',
    'InvitationsService'];

  function InviteController($scope, $state, $translate, $timeout, Authentication, $window, MeanTorrentConfig, NotifycationService,
                            InvitationsService) {
    var vm = this;
    vm.inviteConfig = MeanTorrentConfig.meanTorrentConfig.invite;
    vm.user = Authentication.user;

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * getMyInvitations
     */
    vm.getMyInvitations = function () {
      InvitationsService.get({}, function (items) {
        console.log(items);
        vm.my_invitations = items.my_invitations;
        vm.used_invitations = items.used_invitations;
      }, function (res) {
        NotifycationService.showErrorNotify('GET_INVITATIONS_ERROR');
      });
    };
  }
}());
