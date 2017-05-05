(function () {
  'use strict';

  angular
    .module('vip')
    .controller('VipController', VipController);

  VipController.$inject = ['$scope', '$translate', 'localStorageService'];

  function VipController($scope, $translate, localStorageService) {
    var vm = this;

    vm.init = function () {
      var o = localStorageService.get('storage_user_lang');

      if (o === 'en') {
        localStorageService.set('storage_user_lang', 'zh');
        $translate.use('zh');
      } else {
        localStorageService.set('storage_user_lang', 'en');
        $translate.use('en');
      }
    };
  }
}());
