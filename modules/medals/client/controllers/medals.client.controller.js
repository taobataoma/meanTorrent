(function () {
  'use strict';

  angular
    .module('medals')
    .controller('MedalsController', MedalsController);

  MedalsController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$translate', 'MeanTorrentConfig', 'MedalsService', 'NotifycationService', 'DebugConsoleService',
    '$timeout', 'MedalsInfoServices', 'localStorageService', 'marked', 'MiddleDataServices', 'Authentication', 'UsersService', 'ModalConfirmService'];

  function MedalsController($scope, $rootScope, $state, $stateParams, $translate, MeanTorrentConfig, MedalsService, NotifycationService, mtDebug,
                            $timeout, MedalsInfoServices, localStorageService, marked, MiddleDataServices, Authentication, UsersService, ModalConfirmService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.medalsConfig = MeanTorrentConfig.meanTorrentConfig.medals;
    vm.homeConfig = MeanTorrentConfig.meanTorrentConfig.home;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

    /**
     * initTopBackground
     */
    vm.initTopBackground = function () {
      var url = localStorageService.get('body_background_image') || vm.homeConfig.bodyBackgroundImage;
      $('.backdrop').css('backgroundImage', 'url("' + url + '")');
    };

    /**
     * getMedals
     */
    vm.getMedals = function () {
      MedalsService.count(function (res) {
        vm.medals = MedalsInfoServices.getMedalsAll();

        angular.forEach(vm.medals.items, function (md) {
          md.count = 0;
          for (var i = 0; i < res.length; i++) {
            if (md.name === res[i]._id) {
              md.count = res[i].count;
              break;
            }
          }
        });

        vm.medals.typesLength = Object.keys(vm.medals.types).length;
        vm.medals.itemCount = vm.medals.items.map(function (x) {
          return x.count;
        }).reduce(function (a, b) {
          return a + b;
        });

        // MiddleDataServices.setData('medals', vm.medals);
        mtDebug.info(vm.medals);

        vm.getUserMedals();
      });
    };

    /**
     * getUserMedals
     */
    vm.getUserMedals = function () {
      MedalsService.query({
        userId: vm.user._id
      }, function (medals) {
        vm.userMedals = medals;
      });
    };

    /**
     * hasMedal
     * @param md
     * @returns {boolean}
     */
    vm.hasMedal = function (md) {
      var has = false;
      if (md) {
        angular.forEach(vm.userMedals, function (m) {
          if (m.medalName === md.name) {
            has = true;
          }
        });
      }
      return has;
    };

    /**
     * getMedalOverviewContent
     * @returns {*}
     */
    vm.getMedalOverviewContent = function () {
      var str = $translate.instant('MEDALS.MEDALS_OVERVIEW');
      return marked(str, {sanitize: true});
    };

    /**
     * initMedal
     */
    vm.getMedal = function () {
      MedalsService.count({
        mName: $state.params.medalName
      }, function (res) {
        vm.medal = MedalsInfoServices.getMedal($state.params.medalName);
        vm.medal.count = res[0].count;
        mtDebug.info(vm.medal);
      });

      vm.getUserMedals();
      vm.buildPager();
    };

    /**
     * buildPager
     * pagination init
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.medalUsersListPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.resultMsg = 'MEDALS.USERS_IS_LOADING';
      vm.getMedalUsers(vm.currentPage, function (items) {
        mtDebug.info(items);
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (vm.pagedItems.length === 0) {
          vm.resultMsg = 'MEDALS.USERS_IS_EMPTY';
        } else {
          vm.resultMsg = undefined;
        }

        if (callback) callback();
      });
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_medal_users_list');

      vm.figureOutItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop - 30}, 200);
        }, 10);
      });
    };

    /**
     * getTraces
     * @param p
     * @param callback
     */
    vm.getMedalUsers = function (p, callback) {
      MedalsService.view({
        medalName: $state.params.medalName,
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage
      }, function (res) {
        callback(res);
      });
    };

    /**
     * inMyFollowing
     * @returns {boolean}
     */
    vm.inMyFollowing = function (u) {
      return vm.user.following.indexOf(u._id) >= 0 ? true : false;
    };

    /**
     * followTo
     */
    vm.followTo = function (u) {
      UsersService.userFollowTo({
        userId: u._id
      }).then(onSuccess)
        .catch(onError);

      function onSuccess(response) {
        vm.user = Authentication.user = response;
        $rootScope.$broadcast('user-follow-changed', response);

        NotifycationService.showSuccessNotify('FOLLOW_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify($translate.instant(response.data.message, {name: u.displayName}), 'FOLLOW_ERROR');
      }
    };

    /**
     * unFollowTo
     */
    vm.unFollowTo = function (u) {
      UsersService.userUnfollowTo({
        userId: u._id
      }).then(onSuccess)
        .catch(onError);

      function onSuccess(response) {
        vm.user = Authentication.user = response;
        $rootScope.$broadcast('user-follow-changed', response);

        NotifycationService.showSuccessNotify('UNFOLLOW_SUCCESSFULLY');
      }

      function onError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'UNFOLLOW_ERROR');
      }
    };

    /**
     * requestMedal
     * @param md
     */
    vm.requestMedal = function (md) {
      var modalOptions = {
        closeButtonText: $translate.instant('MEDALS.REQUEST_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('MEDALS.REQUEST_CONFIRM_OK'),
        headerText: $translate.instant('MEDALS.REQUEST_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('MEDALS.REQUEST_CONFIRM_BODY_TEXT', {
          score: md.score
        })
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          MedalsService.request({
            medalName: md.name
          }, function (res) {
            successCallback(res);
          }, function (err) {
            errorCallback(err);
          });

          function successCallback(res) {
            if ($state.current.name === 'medals.view') {
              vm.filterLength += 1;
              vm.currentPage = Math.ceil(vm.filterLength / vm.itemsPerPage);
              vm.buildPager();
            }
            vm.userMedals.push(res);
            NotifycationService.showSuccessNotify('MEDALS.REQUEST_SUCCESSFULLY');
          }

          function errorCallback(res) {
            NotifycationService.showErrorNotify(res.data.message, 'MEDALS.REQUEST_ERROR');
          }
        });

    };
  }
}());
