(function () {
  'use strict';

  angular
    .module('backup')
    .controller('BackupController', BackupController);

  BackupController.$inject = ['$scope', '$timeout', 'getStorageLangService', 'MeanTorrentConfig', 'BackupService', 'NotifycationService',
    'DebugConsoleService', '$filter'];

  function BackupController($scope, $timeout, getStorageLangService, MeanTorrentConfig, BackupService, NotifycationService,
                            mtDebug, $filter) {
    var vm = this;
    vm.lang = getStorageLangService.getLang();
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

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
  }
}());
