(function () {
  'use strict';

  angular
    .module('tickets')
    .controller('MessageTicketController', MessageTicketController);

  MessageTicketController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'MessageTicketsService', 'ModalConfirmService', 'NotifycationService', 'marked',
    'DebugConsoleService', 'MeanTorrentConfig', '$filter', '$rootScope', 'MailTicketsService'];

  function MessageTicketController($scope, $state, $timeout, $translate, Authentication, MessageTicketsService, ModalConfirmService, NotifycationService, marked,
                                   mtDebug, MeanTorrentConfig, $filter, $rootScope, MailTicketsService) {
    var vm = this;
    $rootScope.$state = $state;
    vm.user = Authentication.user;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.supportConfig = MeanTorrentConfig.meanTorrentConfig.support;

    /**
     * getOpenedTicketsNumber
     */
    vm.getOpenedTicketsNumber = function () {
      MessageTicketsService.getOpenedCount(function (res) {
        $scope.messageOpened = res.opened;
      });
      MailTicketsService.getOpenedCount(function (res) {
        $scope.mailOpened = res.opened;
      });
    };

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
        $rootScope.messageOpened = items.opened;

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

    /**
     * handleTicket
     */
    vm.handleTicket = function (t) {
      var modalOptions = {
        closeButtonText: $translate.instant('SUPPORT.HANDLE_TICKET_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('SUPPORT.HANDLE_TICKET_CONFIRM_OK'),
        headerText: $translate.instant('SUPPORT.HANDLE_TICKET_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('SUPPORT.HANDLE_TICKET_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          MessageTicketsService.handle({
            messageTicketId: t._id
          }, function (res) {
            // vm.ticket = res;
            vm.pagedItems[vm.pagedItems.indexOf(t)] = res;
            NotifycationService.showSuccessNotify('SUPPORT.HANDLE_TICKET_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'SUPPORT.HANDLE_TICKET_FAILED');
          });
        });
    };
  }
}());
