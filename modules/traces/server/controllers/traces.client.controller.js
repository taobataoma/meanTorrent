(function () {
  'use strict';

  angular
    .module('traces')
    .controller('TracesController', TracesController);

  TracesController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$filter', 'NotifycationService', '$stateParams', 'MessagesService',
    'MeanTorrentConfig', 'ModalConfirmService', 'marked', '$rootScope'];

  function TracesController($scope, $state, $translate, $timeout, Authentication, $filter, NotifycationService, $stateParams, MessagesService,
                             MeanTorrentConfig, ModalConfirmService, marked, $rootScope) {
    var vm = this;

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

  }
}());
