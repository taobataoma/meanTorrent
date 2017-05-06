(function () {
  'use strict';

  angular
    .module('vip')
    .controller('VipController', VipController);

  VipController.$inject = ['$scope', '$translate', 'getStorageLangService'];

  function VipController($scope, $translate, getStorageLangService) {
    var vm = this;
    vm.lang = getStorageLangService.getLang();

    vm.init = function () {

    };
  }
}());
