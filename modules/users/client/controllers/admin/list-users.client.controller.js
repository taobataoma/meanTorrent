(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$filter', 'AdminService', 'DebugConsoleService', 'MeanTorrentConfig', '$timeout'];

  function UserListController($scope, $filter, AdminService, mtDebug, MeanTorrentConfig, $timeout) {
    var vm = this;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.searchVip = false;
    vm.searchAdmin = false;
    vm.searchOper = false;

    /**
     * buildPager
     */
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.adminUserListPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    function figureOutItemsToDisplay(callback) {
      vm.getUsers(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (callback) callback();
      });

    }

    /**
     * getUsers
     * @param p
     * @param callback
     */
    vm.getUsers = function (p, callback) {
      AdminService.get({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage,
        isVip: vm.searchVip || undefined,
        isOper: vm.searchOper || undefined,
        isAdmin: vm.searchAdmin || undefined,
        keys: vm.search
      }, function (data) {
        mtDebug.info(data);
        callback(data);
      });
    };


    /**
     * pageChanged
     */
    function pageChanged() {
      var element = angular.element('#top_of_users_list');

      vm.figureOutItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop + 15}, 200);
        }, 10);
      });
    }

  }
}());
