(function () {
  'use strict';

  angular
    .module('tickets')
    .controller('MessageTicketController', MessageTicketController);

  MessageTicketController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'MessageTicketsService', 'ModalConfirmService', 'NotifycationService', 'marked',
    'DebugConsoleService', 'MeanTorrentConfig', '$filter', '$rootScope'];

  function MessageTicketController($scope, $state, $timeout, $translate, Authentication, MessageTicketsService, ModalConfirmService, NotifycationService, marked,
                                   mtDebug, MeanTorrentConfig, $filter, $rootScope) {
    var vm = this;
    $rootScope.$state = $state;
    vm.user = Authentication.user;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.supportConfig = MeanTorrentConfig.meanTorrentConfig.support;


    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.messageTicketsListPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.getMessageTickets(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (callback) callback();
      });
    };

    /**
     * getMessageTickets
     */
    vm.getMessageTickets = function (p, callback) {
      vm.statusMsg = 'SUPPORT.STATUS_GETTING';

      MessageTicketsService.get({
        status: 'all',
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage
      }, function (data) {
        mtDebug.info(data);
        vm.statusMsg = undefined;
        callback(data);
      }, function (res) {
        vm.statusMsg = 'SUPPORT.STATUS_GETTING_ERROR';
      });
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_tickets_list');

      vm.figureOutItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
        }, 10);
      });
    };

  }
}());
