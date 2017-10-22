(function () {
  'use strict';

  angular
    .module('users')
    .controller('UserWarningController', UserWarningController);

  UserWarningController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'Notification', 'PeersService',
    'MeanTorrentConfig', '$window', '$filter', 'DownloadService', 'DebugConsoleService', 'TorrentGetInfoServices', 'ModalConfirmService',
    'NotifycationService', 'CompleteService', 'ResourcesTagsServices'];

  function UserWarningController($scope, $state, $translate, $timeout, Authentication, Notification, PeersService, MeanTorrentConfig,
                                 $window, $filter, DownloadService, mtDebug, TorrentGetInfoServices, ModalConfirmService,
                                 NotifycationService, CompleteService, ResourcesTagsServices) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = Authentication.user;
    vm.RTS = ResourcesTagsServices;

    vm.searchTags = [];

    /**
     * getUserWarningTorrent
     */
    vm.getUserWarningTorrent = function () {
      PeersService.getUserWarningList({
        userId: $state.params.userId
      }, function (items) {
        for (var i = items.length - 1; i >= 0; i--) {
          if (!items[i].torrent) {
            items.splice(i, 1);
          }
        }
        vm.userWarningList = items;
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('WARNING_LIST_ERROR')
        });
      });
    };

    /**
     * openTorrentInfo
     * @param id
     */
    vm.openTorrentInfo = function (id) {
      var url = $state.href('torrents.view', {torrentId: id});
      $window.open(url, '_blank');
    };

    /**
     * removeWarning
     * @param comp
     */
    vm.removeWarning = function (comp) {
      var modalOptions = {
        closeButtonText: $translate.instant('REMOVE_WARNING_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('REMOVE_WARNING_CONFIRM_OK'),
        headerText: $translate.instant('REMOVE_WARNING_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('REMOVE_WARNING_CONFIRM_BODY_TEXT_ADMIN')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          CompleteService.update({
            completeId: comp._id
          }, function (response) {
            successCallback(response);
          }, function (errorResponse) {
            errorCallback(errorResponse);
          });

          function successCallback(res) {
            vm.userWarningList.splice(vm.userWarningList.indexOf(comp), 1);
            NotifycationService.showSuccessNotify('REMOVE_WARNING_SUCCESSFULLY');
          }

          function errorCallback(res) {
            NotifycationService.showErrorNotify(res.data.message, 'REMOVE_WARNING_ERROR');
          }
        });
    };
  }
}());
