(function () {
  'use strict';

  angular
    .module('rules')
    .controller('RulesController', RulesController);

  RulesController.$inject = ['$scope', '$translate', 'getStorageLangService'];

  function RulesController($scope, $translate, getStorageLangService) {
    var vm = this;
    vm.lang = getStorageLangService.getLang();

    vm.init = function () {

    };
  }
}());
