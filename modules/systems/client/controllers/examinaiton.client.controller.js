(function () {
  'use strict';

  angular
    .module('systems')
    .controller('ExaminationController', ExaminationController);

  ExaminationController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'SystemsService', 'ModalConfirmService', 'NotifycationService', 'marked',
    'DebugConsoleService', 'MeanTorrentConfig'];

  function ExaminationController($scope, $state, $timeout, $translate, Authentication, SystemsService, ModalConfirmService, NotifycationService, marked,
                                 mtDebug, MeanTorrentConfig) {
    var vm = this;
    vm.user = Authentication.user;
    vm.examinationConfig = MeanTorrentConfig.meanTorrentConfig.examination;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

    vm.statusType = 'finished';

    /**
     * initExaminationData
     */
    vm.initExaminationData = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('SYSTEMS.CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('SYSTEMS.INIT_EXAMINATION_CONFIRM_CONTINUE'),
        headerText: $translate.instant('SYSTEMS.INIT_EXAMINATION_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('SYSTEMS.INIT_EXAMINATION_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          SystemsService.initExaminationData(function (res) {
            console.log(res);
            NotifycationService.showSuccessNotify('SYSTEMS.INIT_EXAMINATION_SUCCESSFULLY');
          }, function (err) {
            NotifycationService.showErrorNotify(err.data.message, 'SYSTEMS.INIT_EXAMINATION_ERRORU');
          });
        });
    };

    /**
     * getExaminationStatus
     */
    vm.getExaminationStatus = function () {
      SystemsService.getExaminationStatus(function (res) {
        vm.examinationStatusResult = res;
      });
    };

    /**
     * buildPager
     * pagination init
     */
    vm.buildPager = function (type) {
      var element = angular.element('#top_of_status_list');

      vm.showStatusUsers = true;
      vm.statusType = type;
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.examinationUserListPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop + 15}, 200);
        }, 10);
      });
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.pagedItems = undefined;
      vm.resultMsg = 'SYSTEMS.STATUS_USERS_IS_LOADING';
      vm.getStatusUsers(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (vm.pagedItems.length === 0) {
          vm.resultMsg = 'SYSTEMS.STATUS_USERS_IS_EMPTY';
        } else {
          vm.resultMsg = undefined;
        }

        if (callback) callback();
      });
    };

    /**
     * getStatusUsers
     * @param p
     * @param callback
     */
    vm.getStatusUsers = function (p, callback) {
      if (vm.statusType === 'finished') {
        SystemsService.listFinishedUsers({
          skip: (p - 1) * vm.itemsPerPage,
          limit: vm.itemsPerPage
        }, function (data) {
          callback(data);
        });
      } else {
        SystemsService.listUnfinishedUsers({
          skip: (p - 1) * vm.itemsPerPage,
          limit: vm.itemsPerPage
        }, function (data) {
          callback(data);
        });
      }
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_status_list');

      vm.figureOutItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop + 15}, 200);
        }, 10);
      });
    };

    /**
     * banAllUnfinishedUser
     */
    vm.banAllUnfinishedUser = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('SYSTEMS.CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('SYSTEMS.BAN_CONFIRM_SAVE'),
        headerText: $translate.instant('SYSTEMS.BAN_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('SYSTEMS.BAN_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          SystemsService.banAllUnfinishedUser(function (res) {
            mtDebug.info(res);
            NotifycationService.showSuccessNotify('SYSTEMS.BAN_SUCCESSFULLY');
          }, function (err) {
            NotifycationService.showErrorNotify(err.data.message, 'SYSTEMS.BAN_FAILED');
          });
        });
    };
  }
}());
