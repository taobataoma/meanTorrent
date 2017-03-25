(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$translate'];

  function HomeController($scope, $translate) {
    var vm = this;

    //$translate.use('en');

    vm.COMING = 'coming soon...';
  }
}());
