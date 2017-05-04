(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsController', ForumsController);

  ForumsController.$inject = ['$scope', '$translate'];

  function ForumsController($scope, $translate) {
    var vm = this;

    vm.init = function () {

    };
  }
}());
