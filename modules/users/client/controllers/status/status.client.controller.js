(function () {
  'use strict';

  angular
    .module('users')
    .controller('StatusController', StatusController);

  StatusController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$window'];

  function StatusController($scope, $state, $translate, $timeout, Authentication, $window) {
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
