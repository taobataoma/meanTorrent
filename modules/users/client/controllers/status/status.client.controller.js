(function () {
  'use strict';

  angular
    .module('users')
    .controller('StatusController', StatusController);

  StatusController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'Notification', 'TorrentsService',
    'MeanTorrentConfig', '$window'];

  function StatusController($scope, $state, $translate, $timeout, Authentication, Notification, TorrentsService, MeanTorrentConfig,
                              $window) {
    var vm = this;
    vm.user = Authentication.user;

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

  }
}());
