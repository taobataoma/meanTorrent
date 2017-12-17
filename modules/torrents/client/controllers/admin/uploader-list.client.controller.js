(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('UploaderAdminController', UploaderAdminController);

  UploaderAdminController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'Notification', 'MakerGroupService',
    'MeanTorrentConfig', 'AdminService', '$window', 'ModalConfirmService', 'NotifycationService', 'DebugConsoleService', 'TorrentGetInfoServices',
    'ResourcesTagsServices', 'localStorageService'
  ];

  function UploaderAdminController($scope, $state, $translate, $timeout, Authentication, Notification, MakerGroupService, MeanTorrentConfig,
                                   AdminService, $window, ModalConfirmService, NotifycationService, mtDebug, TorrentGetInfoServices,
                                   ResourcesTagsServices, localStorageService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.TGI = TorrentGetInfoServices;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

    /**
     * init
     */
    vm.init = function () {
      vm.getUploadByMaker();
      vm.buildUploadUserPager();
    };

    /**
     * getUploadByMaker
     */
    vm.getUploadByMaker = function () {
      MakerGroupService.query(function (data) {
        vm.uploadMakerList = data;
        mtDebug.info(data);
      });
    };

    /**
     * buildPager
     */
    vm.buildUploadUserPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.uploaderUserListPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.getUploadByUser(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (callback) callback();
      });
    };

    /**
     * getUploadByUser
     */
    vm.getUploadByUser = function (p, callback) {
      AdminService.getUploaderList({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage
      })
        .then(onSuccess);

      function onSuccess(data) {
        mtDebug.info(data);
        callback(data);
      }
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_user_list');

      vm.figureOutItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
        }, 10);
      });
    };

    /**
     * onUploaderMakerAccessChanged
     * @param m
     */
    vm.onUploaderMakerAccessChanged = function (m) {
      m.$update(function (res) {
        vm.uploadMakerList[vm.uploadMakerList.indexOf(m)] = res;
        NotifycationService.showSuccessNotify('UPLOADER.ACCESS_CHANGED_SUCCESSFULLY');
      });
    };

    /**
     * onUploaderUserAccessChanged
     * @param u
     */
    vm.onUploaderUserAccessChanged = function (u) {
      var user = new AdminService(u);
      user.$update(function (res) {
        vm.pagedItems[vm.pagedItems.indexOf(u)] = res;
        NotifycationService.showSuccessNotify('UPLOADER.ACCESS_CHANGED_SUCCESSFULLY');
      });
    };
  }
}());
