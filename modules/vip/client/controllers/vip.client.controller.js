(function () {
  'use strict';

  angular
    .module('vip')
    .controller('VipController', VipController);

  VipController.$inject = ['$scope', '$translate'];

  function VipController($scope, $translate) {
    var vm = this;

    vm.init = function () {

    };
  }
}());
