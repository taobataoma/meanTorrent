(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('RulesController', RulesController);

  RulesController.$inject = ['$scope', '$translate'];

  function RulesController($scope, $translate) {
    var vm = this;

    vm.init = function () {

    };
  }
}());
