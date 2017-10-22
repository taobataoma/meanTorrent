(function () {
  'use strict';

  angular
    .module('invitations')
    .controller('InviteController', InviteController);

  InviteController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'MeanTorrentConfig', 'NotifycationService',
    'InvitationsService', '$rootScope', 'moment'];

  function InviteController($scope, $state, $translate, $timeout, Authentication, $window, MeanTorrentConfig, NotifycationService,
                            InvitationsService, $rootScope, moment) {
    var vm = this;
    vm.inviteConfig = MeanTorrentConfig.meanTorrentConfig.invite;
    vm.user = Authentication.user;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;

    vm.invitePopover = {
      title: 'INVITATION.TITLE_SEND',
      templateUrl: 'invite.html',
      items: [],
      sending: false
    };

    vm.subuserPopover = {
      templateUrl: 'userinfo.html'
    };

    /**
     * user-invitations-changed
     */
    $scope.$on('user-invitations-changed', function (event, args) {
      vm.getMyInvitations();
    });

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

    /**
     * sendClicked
     * @param idx
     */
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
          $rootScope.$broadcast('user-invitations-changed');
        }, function (res) {
          NotifycationService.showErrorNotify(res.data.message, 'SEND_INVITE_ERROR');
          vm.invitePopover.sending = false;
        });
      }
    };

    /**
     * getInvitationStatus
     * @param invitation
     */
    vm.getInvitationStatus = function (invitation) {
      if (invitation.status === 2) {
        return $translate.instant('INVITATION.TITLE_STATUS_REGED');
      } else {
        if (moment(invitation.expiresat) > moment(Date.now())) {
          return $translate.instant('INVITATION.TITLE_STATUS_UNREGED');
        } else {
          return $translate.instant('INVITATION.TITLE_STATUS_EXPIRED');
        }
      }
    };
  }
}());
