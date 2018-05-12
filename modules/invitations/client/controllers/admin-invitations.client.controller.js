(function () {
  'use strict';

  angular
    .module('invitations.admin')
    .controller('AdminInvitationController', AdminInvitationController);

  AdminInvitationController.$inject = ['$scope', '$state', 'Authentication', 'InvitationsService', 'NotifycationService', 'DebugConsoleService', '$translate',
    'MeanTorrentConfig', '$filter', '$timeout', 'ModalConfirmService'];

  function AdminInvitationController($scope, $state, Authentication, InvitationsService, NotifycationService, mtDebug, $translate,
                                     MeanTorrentConfig, $filter, $timeout, ModalConfirmService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

    vm.invitationFields = {
      isOfficial: true
    };

    vm.subuserPopover = {
      templateUrl: 'userinfo.html'
    };

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.invitationsListPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     */
    vm.figureOutItemsToDisplay = function (callback) {
      console.log(vm.currentPage);
      vm.filteredItems = $filter('filter')(vm.offlist, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);

      if (callback) callback();
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_invitations_list');

      $('.tb-v-middle').fadeTo(100, 0.01, function () {
        vm.figureOutItemsToDisplay(function () {
          $timeout(function () {
            $('.tb-v-middle').fadeTo(400, 1, function () {
              //window.scrollTo(0, element[0].offsetTop - 60);
              $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
            });
          }, 100);
        });
      });
    };

    /**
     * sendOfficialInvitation
     */
    vm.sendOfficialInvitation = function () {
      if (vm.invitationFields.email) {
        var invitation = new InvitationsService(vm.invitationFields);

        invitation.$sendOfficial(function (res) {
          mtDebug.info(res);
          NotifycationService.showSuccessNotify('ADMIN_INVITATION_SUCCESSFULLY');
        }, function (res) {
          NotifycationService.showErrorNotify(res.data.message, 'ADMIN_INVITATION_ERROR');
        });
      }
    };

    /**
     * getOfficialInvitations
     */
    vm.getOfficialInvitations = function () {
      InvitationsService.listOfficial(function (res) {
        vm.offlist = res;
        mtDebug.info(res);
        vm.buildPager();
      });
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

    /**
     * deleteExpiredOfficialInvitation
     */
    vm.deleteExpiredOfficialInvitation = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('DELETE_EXPIRED_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('DELETE_EXPIRED_CONFIRM_OK'),
        headerText: $translate.instant('DELETE_EXPIRED_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('DELETE_EXPIRED_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          InvitationsService.deleteExpiredOfficialInvitation(function (response) {
            NotifycationService.showSuccessNotify('DELETE_EXPIRED_SUCCESSFULLY');
            $timeout(function () {
              $state.reload();
            }, 100);
          }, function (response) {
            NotifycationService.showErrorNotify(response.data.message, 'DELETE_EXPIRED_ERROR');
          });
        });
    };
  }
}());
