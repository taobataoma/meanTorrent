(function () {
  'use strict';

  angular
    .module('vip')
    .controller('VipController', VipController);

  VipController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'getStorageLangService'];

  function VipController($scope, $state, $translate, Authentication, getStorageLangService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.lang = getStorageLangService.getLang();

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    vm.init = function () {

    };
  }
}());
