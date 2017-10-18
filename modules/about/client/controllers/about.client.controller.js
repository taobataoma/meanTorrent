(function () {
  'use strict';

  angular
    .module('about')
    .controller('AboutController', AboutController);

  AboutController.$inject = ['$scope', '$translate', 'getStorageLangService'];

  function AboutController($scope, $translate, getStorageLangService) {
    var vm = this;
    vm.lang = getStorageLangService.getLang();

    vm.init = function () {

    };
  }
}());
