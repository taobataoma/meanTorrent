(function () {
  'use strict';

  angular
    .module('collections.admin')
    .controller('CollectionAdminController', CollectionAdminController);

  CollectionAdminController.$inject = ['$scope', '$translate', 'getStorageLangService'];

  function CollectionAdminController($scope, $translate, getStorageLangService) {
    var vm = this;
    vm.lang = getStorageLangService.getLang();

    vm.init = function () {

    };
  }
}());
