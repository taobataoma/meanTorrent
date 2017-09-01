(function () {
  'use strict';

  angular
    .module('traces')
    .controller('TracesController', TracesController);

  TracesController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$filter', 'NotifycationService', '$stateParams', 'MessagesService',
    'MeanTorrentConfig', 'ModalConfirmService', 'marked', '$rootScope', 'TracesService'];

  function TracesController($scope, $state, $translate, $timeout, Authentication, $filter, NotifycationService, $stateParams, MessagesService,
                            MeanTorrentConfig, ModalConfirmService, marked, $rootScope, TracesService) {
    var vm = this;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * buildPager
     * pagination init
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.tracesPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.getTraces(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (callback) callback();
      });
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_traces_list');

      vm.figureOutItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop + 15}, 200);
        }, 10);
      });
    };

    /**
     * getTraces
     * @param p
     * @param callback
     */
    vm.getTraces = function (p, callback) {
      TracesService.get({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage
      }, function (data) {
        callback(data);
      });
    };
  }
}());
