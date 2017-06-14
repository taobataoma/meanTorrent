(function () {
  'use strict';

  angular
    .module('invitations')
    .controller('InviteController', InviteController);

  InviteController.$inject = ['$rootScope', '$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'MeanTorrentConfig',
    'NotifycationService', 'InvitationsService'];

  function InviteController($rootScope, $scope, $state, $translate, $timeout, Authentication, $window, MeanTorrentConfig, NotifycationService,
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
     * init
     */
    vm.init = function () {
    };
  }
}());
