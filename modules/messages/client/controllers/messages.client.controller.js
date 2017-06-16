(function () {
  'use strict';

  angular
    .module('messages')
    .controller('MessageController', MessageController);

  MessageController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'MeanTorrentConfig', 'NotifycationService', '$rootScope'];

  function MessageController($scope, $state, $translate, $timeout, Authentication, $window, MeanTorrentConfig, NotifycationService, $rootScope) {
    var vm = this;
    vm.messageConfig = MeanTorrentConfig.meanTorrentConfig.messages;
    vm.user = Authentication.user;

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

  }
}());
