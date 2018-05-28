(function () {
  'use strict';

  angular
    .module('invitations')
    .controller('InviteController', InviteController);

  InviteController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'MeanTorrentConfig', 'NotifycationService',
    'InvitationsService', '$rootScope', 'moment', 'DebugConsoleService', '$filter'];

  function InviteController($scope, $state, $translate, $timeout, Authentication, $window, MeanTorrentConfig, NotifycationService,
                            InvitationsService, $rootScope, moment, mtDebug, $filter) {
    var vm = this;
    vm.inviteConfig = MeanTorrentConfig.meanTorrentConfig.invite;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.user = Authentication.user;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

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
     * myBuildPager
     */
    vm.myBuildPager = function () {
      vm.myPagedItems = [];
      vm.myItemsPerPage = vm.itemsPerPageConfig.userInvitationsListPerPage;
      vm.myCurrentPage = 1;
      vm.myFigureOutItemsToDisplay();
    };

    /**
     * myFigureOutItemsToDisplay
     */
    vm.myFigureOutItemsToDisplay = function (callback) {
      vm.myFilteredItems = vm.my_invitations;
      vm.myFilterLength = vm.myFilteredItems.length;
      var begin = ((vm.myCurrentPage - 1) * vm.myItemsPerPage);
      var end = begin + vm.myItemsPerPage;
      vm.myPagedItems = vm.myFilteredItems.slice(begin, end);

      if (callback) callback();
    };

    /**
     * myPageChanged
     */
    vm.myPageChanged = function () {
      var element = angular.element('#top_of_my_invitations_list');
      console.log(element);

      $('.tb-my').fadeTo(100, 0.01, function () {
        vm.myFigureOutItemsToDisplay(function () {
          $timeout(function () {
            $('.tb-my').fadeTo(400, 1, function () {
              console.log(element[0].offsetTop);
              //window.scrollTo(0, element[0].offsetTop - 60);
              $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
            });
          }, 100);
        });
      });
    };

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.userInvitationsListPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.filteredItems = $filter('filter')(vm.used_invitations, {
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
      console.log(element);
      $('.tb-official').fadeTo(100, 0.01, function () {
        vm.figureOutItemsToDisplay(function () {
          $timeout(function () {
            $('.tb-official').fadeTo(400, 1, function () {
              //window.scrollTo(0, element[0].offsetTop - 60);
              console.log(element[0].offsetTop);
              $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
            });
          }, 100);
        });
      });
    };

    /**
     * getMyInvitations
     */
    vm.getMyInvitations = function () {
      InvitationsService.get({}, function (items) {
        mtDebug.info(items);
        vm.my_invitations = items.my_invitations;
        vm.used_invitations = items.used_invitations;

        angular.forEach(vm.my_invitations, function (i) {
          vm.invitePopover.items.push({isOpen: false});
        });

        vm.myBuildPager();
        vm.buildPager();
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
