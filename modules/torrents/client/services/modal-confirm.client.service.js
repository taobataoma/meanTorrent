(function () {
  'use strict';

  angular
    .module('torrents.services')
    .factory('ModalConfirmService', ModalConfirmService);

  ModalConfirmService.$inject = ['$uibModal'];

  function ModalConfirmService($uibModal) {
    var cModalOptions = {};
    var tModalOptions = {};

    var modalOptions = {
      closeButtonText: 'Close',
      actionButtonText: 'Yes',
      headerText: 'Confirm?',
      bodyText: 'Confirm this action?',
      bodyParams: undefined,
      selectOptions: {
        enable: false,
        title: undefined,
        options: []
      }
    };

    var modalDefaults = {
      backdrop: true,
      keyboard: true,
      modalFade: true,
      templateUrl: '/modules/torrents/client/templates/modal-confirm.client.view.html',
      controller: 'ModalConfirmController',
      resolve: {
        modalOptions: function () {
          //Map modal.html $scope custom properties to defaults defined in service
          angular.extend(tModalOptions, modalOptions, cModalOptions);
          return tModalOptions;
        }
      }
    };

    var showModal = function (customModalDefaults, customModalOptions) {
      if (!customModalDefaults) customModalDefaults = {};
      customModalDefaults.backdrop = 'static';

      return this.show(customModalDefaults, customModalOptions);
    };

    var show = function (customModalDefaults, customModalOptions) {
      //Create temp objects to work with since we're in a singleton service
      var tempModalDefaults = {};

      cModalOptions = customModalOptions;

      //Map angular-ui modal custom defaults to modal defaults defined in service
      angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

      return $uibModal.open(tempModalDefaults).result;
    };

    return {
      showModal: showModal,
      show: show
    };

  }

  angular
    .module('torrents')
    .controller('ModalConfirmController', ModalConfirmController);

  ModalConfirmController.$inject = ['$scope', '$uibModalInstance', 'modalOptions'];

  function ModalConfirmController($scope, $uibModalInstance, modalOptions) {
    $scope.optionSelected = {
      value: 'NULL',
      custom: undefined
    };

    $scope.modalOptions = modalOptions;
    $scope.modalOptions.ok = function (result) {
      $uibModalInstance.close(result);
    };
    $scope.modalOptions.close = function (result) {
      $uibModalInstance.dismiss('cancel');
    };
  }

}());

