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

    vm.invitePopover = {
      title: 'INVITATION.TITLE_SEND',
      templateUrl: 'invite.html',
      items: [],
      sending: false
    };

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
        vm.my_invitations = items.my_invitations;
        vm.used_invitations = items.used_invitations;

        angular.forEach(vm.my_invitations, function (i) {
          vm.invitePopover.items.push({isOpen: false});
        });
      }, function (res) {
        NotifycationService.showErrorNotify('GET_INVITATIONS_ERROR');
      });
    };

    vm.sendClicked = function (idx) {
      vm.invitePopover.email = undefined;
      vm.invitePopover.items[idx].isOpen = true;
      vm.invitePopover.selected = idx;
      vm.invitePopover.sending = false;
    };

    /**
     * invite
     * @param inx
     */
    vm.invite = function (idx) {
      if (vm.invitePopover.email) {
        vm.invitePopover.sending = true;
        var invitation = new InvitationsService(vm.my_invitations[idx]);
        invitation.$update({
          to_email: vm.invitePopover.email
        }, function (res) {
          NotifycationService.showSuccessNotify('SEND_INVITE_SUCCESSFULLY');
          vm.invitePopover.items[idx].isOpen = false;
          vm.invitePopover.sending = false;
          vm.getMyInvitations();
        }, function (res) {
          NotifycationService.showErrorNotify(res.data.message, 'SEND_INVITE_ERROR');
          vm.invitePopover.sending = false;
        });
      }
    };
  }
}());
