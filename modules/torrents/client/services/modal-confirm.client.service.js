(function () {
  'use strict';

  angular
    .module('torrents.services')
    .factory('ModalConfirmService', ModalConfirmService);

  ModalConfirmService.$inject = ['$uibModal'];

  function ModalConfirmService($uibModal) {

    var modalDefaults = {
      backdrop: true,
      keyboard: true,
      modalFade: true,
      templateUrl: '/modules/torrents/client/templates/modal-confirm.client.view.html'
    };

    var modalOptions = {
      closeButtonText: 'Close',
      actionButtonText: 'Yes',
      headerText: 'Confirm?',
      bodyText: 'Confirm this action?',
      bodyParams: undefined
    };

    var showModal = function (customModalDefaults, customModalOptions) {
      if (!customModalDefaults) customModalDefaults = {};
      customModalDefaults.backdrop = 'static';
      return this.show(customModalDefaults, customModalOptions);
    };

    var show = function (customModalDefaults, customModalOptions) {
      //Create temp objects to work with since we're in a singleton service
      var tempModalDefaults = {};
      var tempModalOptions = {};

      //Map angular-ui modal custom defaults to modal defaults defined in service
      angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

      //Map modal.html $scope custom properties to defaults defined in service
      angular.extend(tempModalOptions, modalOptions, customModalOptions);

      if (!tempModalDefaults.controller) {
        tempModalDefaults.controller = function ($scope, $uibModalInstance) {
          $scope.modalOptions = tempModalOptions;
          $scope.modalOptions.ok = function (result) {
            $uibModalInstance.close(result);
          };
          $scope.modalOptions.close = function (result) {
            $uibModalInstance.dismiss('cancel');
          };
        };
      }

      return $uibModal.open(tempModalDefaults).result;
    };

    return {
      showModal: showModal,
      show: show
    };

  }
}());
