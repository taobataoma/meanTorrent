(function () {
  'use strict';

  angular
    .module('tickets')
    .controller('MailTicketController', MailTicketController);

  MailTicketController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'SystemsService', 'ModalConfirmService', 'NotifycationService', 'marked',
    'DebugConsoleService', 'MeanTorrentConfig', '$filter'];

  function MailTicketController($scope, $state, $timeout, $translate, Authentication, SystemsService, ModalConfirmService, NotifycationService, marked,
                                  mtDebug, MeanTorrentConfig, $filter) {
    var vm = this;
    vm.user = Authentication.user;

  }
}());
