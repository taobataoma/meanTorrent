(function () {
  'use strict';

  angular
    .module('tickets')
    .controller('MessageTicketController', MessageTicketController);

  MessageTicketController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'SystemsService', 'ModalConfirmService', 'NotifycationService', 'marked',
    'DebugConsoleService', 'MeanTorrentConfig', '$filter'];

  function MessageTicketController($scope, $state, $timeout, $translate, Authentication, SystemsService, ModalConfirmService, NotifycationService, marked,
                                  mtDebug, MeanTorrentConfig, $filter) {
    var vm = this;
    vm.user = Authentication.user;

  }
}());
