(function () {
  'use strict';

  angular
    .module('invitations.admin')
    .controller('AdminInvitationController', AdminInvitationController);

  AdminInvitationController.$inject = ['$scope', '$state', 'Authentication', 'InvitationsService', 'NotifycationService', 'DebugConsoleService'];

  function AdminInvitationController($scope, $state, Authentication, InvitationsService, NotifycationService, mtDebug) {
    var vm = this;
    vm.user = Authentication.user;
    vm.invitationFields = {
      isOfficial: true
    };
    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * sendOfficialInvitation
     */
    vm.sendOfficialInvitation = function () {
      if (vm.invitationFields.email) {
        var invitation = new InvitationsService(vm.invitationFields);

        invitation.$official(function (res) {
          mtDebug.info(res);
          NotifycationService.showSuccessNotify('ADMIN_INVITATION_SUCCESSFULLY');
        }, function (res) {
          NotifycationService.showErrorNotify(res.data.message, 'EXCHANGE_INVITATION_ERROR');
        });
      }
    };
  }
}());
