(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$filter', 'AdminService', 'DebugConsoleService'];

  function UserListController($scope, $filter, AdminService, mtDebug) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.searchVip = false;
    vm.searchAdmin = false;
    vm.searchOper = false;

    AdminService.query(function (data) {
      vm.users = data;
      mtDebug.info(data);
      vm.buildPager();
    });

    /**
     * buildPager
     */
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    /**
     * figureOutItemsToDisplay
     */
    function figureOutItemsToDisplay() {
      vm.resultUsers = vm.users;
      if (vm.searchVip) {
        vm.resultUsers = $filter('filter')(vm.resultUsers, {
          isVip: true
        });
      }
      if (vm.searchAdmin) {
        vm.resultUsers = $filter('filter')(vm.resultUsers, {
          isAdmin: true
        });
      }
      if (vm.searchOper) {
        vm.resultUsers = $filter('filter')(vm.resultUsers, {
          isOper: true
        });
      }
      vm.filteredItems = $filter('filter')(vm.resultUsers, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    /**
     * pageChanged
     */
    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

  }
}());
