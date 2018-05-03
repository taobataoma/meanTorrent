(function () {
  'use strict';

  angular
    .module('backup')
    .controller('BackupController', BackupController);

  BackupController.$inject = ['$scope', '$timeout', 'Authentication', '$translate', 'MeanTorrentConfig', 'BackupService', 'NotifycationService',
    'DebugConsoleService', '$filter', 'ModalConfirmService', 'DownloadService'];

  function BackupController($scope, $timeout, Authentication, $translate, MeanTorrentConfig, BackupService, NotifycationService,
                            mtDebug, $filter, ModalConfirmService, DownloadService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.DLS = DownloadService;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

    vm.deleteList = [];

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.backupFilesListPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.filteredItems = $filter('orderBy')(vm.fileList, '-ctime');
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);

      if (callback) callback();
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_backup_list');

      $('.tb-v-middle').fadeTo(100, 0.01, function () {
        vm.figureOutItemsToDisplay(function () {
          $timeout(function () {
            $('.tb-v-middle').fadeTo(400, 1, function () {
              //window.scrollTo(0, element[0].offsetTop - 60);
              $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
            });
          }, 100);
        });
      });
    };

    /**
     * getBackupFilesList
     */
    vm.getBackupFilesList = function () {
      BackupService.query(function (items) {
        vm.fileList = items;
        mtDebug.info(items);
        vm.buildPager();
      });
    };

    /**
     * deleteSelected
     */
    vm.deleteSelected = function () {
      vm.deleteList = [];
      var modalOptions = {
        closeButtonText: $translate.instant('ABOUT.DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('ABOUT.DELETE_CONFIRM_OK'),
        headerText: $translate.instant('ABOUT.DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('BACKUP.DELETE_CONFIRM_BODY_TEXT')
      };

      angular.forEach(vm.selected, function (item, id) {
        if (item) {
          vm.deleteList.push(id);
        }
      });

      mtDebug.info(vm.deleteList);

      if (vm.deleteList.length > 0) {
        ModalConfirmService.showModal({}, modalOptions)
          .then(function (result) {
            BackupService.remove({
              names: vm.deleteList
            }, function (res) {
              var s = [];
              angular.forEach(vm.fileList, function (f) {
                if (vm.deleteList.indexOf(f.name) !== -1) {
                  s.push(f);
                }
              });

              angular.forEach(s, function (f) {
                vm.fileList.splice(vm.fileList.indexOf(f), 1);
              });
              vm.selected = undefined;
              vm.figureOutItemsToDisplay();

              NotifycationService.showSuccessNotify('BACKUP.DELETED_SUCCESSFULLY');
            }, function (res) {
              NotifycationService.showErrorNotify(res.data.message, 'BACKUP.DELETED_ERROR');
            });
          });
      }
    };
  }
}());
