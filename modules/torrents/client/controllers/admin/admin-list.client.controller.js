(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsAdminController', TorrentsAdminController);

  TorrentsAdminController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'Notification', 'TorrentsService',
    'MeanTorrentConfig', 'DownloadService', '$window', 'ModalConfirmService', 'NotifycationService', 'DebugConsoleService', 'TorrentGetInfoServices',
    'ResourcesTagsServices', 'localStorageService'
  ];

  function TorrentsAdminController($scope, $state, $translate, $timeout, Authentication, Notification, TorrentsService, MeanTorrentConfig,
                                   DownloadService, $window, ModalConfirmService, NotifycationService, mtDebug, TorrentGetInfoServices,
                                   ResourcesTagsServices, localStorageService) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = Authentication.user;
    vm.RTS = ResourcesTagsServices;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.torrentSalesType = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
    vm.torrentRLevels = MeanTorrentConfig.meanTorrentConfig.torrentRecommendLevel;
    vm.torrentType = MeanTorrentConfig.meanTorrentConfig.torrentType;

    vm.selectedType = localStorageService.get('admin_last_selected_type') || 'movie';
    vm.filterVIP = isSelectedVipType(vm.selectedType);
    vm.searchTags = [];
    vm.searchKey = '';
    vm.releaseYear = undefined;
    vm.filterHnR = false;
    vm.torrentStatus = 'reviewed';
    vm.torrentRLevel = 'none';

    /**
     * commentBuildPager
     * pagination init
     */
    vm.torrentBuildPager = function () {
      vm.torrentPagedItems = [];
      vm.torrentItemsPerPage = 20;
      vm.torrentCurrentPage = 1;
      vm.torrentFigureOutItemsToDisplay();
    };

    /**
     * onTorrentTypeChanged
     */
    vm.onTorrentTypeChanged = function () {
      vm.searchTags = [];
      vm.filterVIP = isSelectedVipType(vm.selectedType);

      vm.torrentBuildPager();
      localStorageService.set('admin_last_selected_type', vm.selectedType);
    };

    /**
     * isSelectedVipType
     * @param type
     * @returns {boolean}
     */
    function isSelectedVipType(type) {
      var v = false;
      angular.forEach(vm.torrentType.value, function (t) {
        if (t.value === type) {
          if (t.role === 'vip') {
            v = true;
          }
        }
      });

      return v;
    }

    /**
     * commentFigureOutItemsToDisplay
     * @param callback
     */
    vm.torrentFigureOutItemsToDisplay = function (callback) {
      vm.getTorrentPageInfo(vm.torrentCurrentPage, function (items) {
        vm.torrentFilterLength = items.total;
        vm.torrentPagedItems = items.rows;

        if (callback) callback();
      });
    };

    /**
     * commentPageChanged
     */
    vm.torrentPageChanged = function () {
      var element = angular.element('#top_of_torrent_list');

      $('.tb-v-middle').fadeTo(100, 0.01, function () {
        vm.torrentFigureOutItemsToDisplay(function () {
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
     * onTorrentStatusClicked
     * @param event
     * @param s: status value
     */
    vm.onTorrentStatusClicked = function (event, s) {
      var e = angular.element(event.currentTarget);

      //if (e.hasClass('btn-success')) {
      //  return;
      //} else {
      //  e.addClass('btn-success').removeClass('btn-default').siblings().removeClass('btn-success').addClass('btn-default');
      //  vm.torrentStatus = s;
      //}
      vm.torrentStatus = s;
      e.blur();
      vm.torrentBuildPager();
    };

    /**
     * onRecommendLevelClicked
     * @param event
     * @param s: status value
     */
    vm.onRecommendLevelClicked = function (event, l) {
      var e = angular.element(event.currentTarget);

      if (vm.torrentRLevel === l) {
        vm.torrentRLevel = 'none';
      } else {
        vm.torrentRLevel = l;
      }

      e.blur();
      vm.torrentBuildPager();
    };

    /**
     * onRadioTagClicked
     * @param event
     * @param n: tag name
     */
    vm.onRadioTagClicked = function (event, n) {
      var e = angular.element(event.currentTarget);

      if (e.hasClass('btn-success')) {
        e.removeClass('btn-success').addClass('btn-default');
        vm.searchTags.splice(vm.searchTags.indexOf(n), 1);
      } else {
        e.addClass('btn-success').removeClass('btn-default').siblings().removeClass('btn-success').addClass('btn-default');
        vm.searchTags.push(n);

        angular.forEach(e.siblings(), function (se) {
          if (vm.searchTags.indexOf(se.value) !== -1) {
            vm.searchTags.splice(vm.searchTags.indexOf(se.value), 1);
          }
        });
      }
      e.blur();
      vm.torrentBuildPager();
    };

    /**
     * onCheckboxTagClicked
     * @param event
     * @param n: tag name
     */
    vm.onCheckboxTagClicked = function (event, n) {
      var e = angular.element(event.currentTarget);

      if (e.hasClass('btn-success')) {
        vm.searchTags.push(n);
      } else {
        vm.searchTags.splice(vm.searchTags.indexOf(n), 1);
      }
      vm.torrentBuildPager();
    };

    /**
     * onKeysKeyDown
     * @param evt
     */
    vm.onKeysKeyDown = function (evt) {
      if (evt.keyCode === 13) {
        vm.torrentBuildPager();
      }
    };

    /**
     * getTorrentPageInfo
     * @param p: page number
     */
    vm.getTorrentPageInfo = function (p, callback) {
      TorrentsService.get({
        skip: (p - 1) * vm.torrentItemsPerPage,
        limit: vm.torrentItemsPerPage,
        keys: vm.searchKey.trim(),
        torrent_status: vm.selectedType === 'newest' ? 'new' : vm.torrentStatus,
        torrent_rlevel: vm.torrentRLevel,
        torrent_type: vm.selectedType === 'newest' ? 'all' : vm.selectedType,
        torrent_release: vm.releaseYear,
        torrent_tags: vm.searchTags,
        torrent_hnr: vm.filterHnR,
        torrent_vip: vm.filterVIP ? vm.filterVIP : undefined,
        torrent_sale: vm.filterSale
      }, function (items) {
        if (items.length === 0) {
          Notification.error({
            message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('MOVIE_PAGE_INFO_EMPTY')
          });
        } else {
          callback(items);
          mtDebug.info(items);
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('MOVIE_PAGE_INFO_ERROR')
        });
      });
    };

    /**
     * clearAllCondition
     */
    vm.clearAllCondition = function () {
      vm.searchKey = '';
      vm.searchTags = [];
      $('.btn-tag').removeClass('btn-success').addClass('btn-default');

      vm.torrentBuildPager();
    };

    /**
     * onTagClicked
     * @param tag: tag name
     */
    vm.onTagClicked = function (tag) {
      $timeout(function () {
        angular.element('#tag_' + tag).trigger('click');
      }, 100);
    };

    /**
     * onReleaseClicked
     * @param y
     */
    vm.onReleaseClicked = function (y) {
      if (vm.releaseYear === y) {
        vm.releaseYear = undefined;
      } else {
        vm.releaseYear = y;
      }
      vm.torrentBuildPager();
    };

    /**
     * onHnRClicked, onHnRChanged
     */
    vm.onHnRClicked = function () {
      vm.filterHnR = !vm.filterHnR;
      vm.torrentBuildPager();
    };
    vm.onHnRChanged = function () {
      vm.torrentBuildPager();
    };

    /**
     * onSaleChanged
     */
    vm.onSaleClicked = function () {
      vm.filterSale = !vm.filterSale;
      vm.torrentBuildPager();
    };
    vm.onSaleChanged = function () {
      vm.torrentBuildPager();
    };

    /**
     * onVIPClicked, onVIPChanged
     */
    vm.onVIPClicked = function () {
      vm.filterVIP = !vm.filterVIP;
      vm.torrentBuildPager();
    };
    vm.onVIPChanged = function () {
      vm.torrentBuildPager();
    };

    /**
     * onRLevelClicked
     * @param y
     */
    vm.onRLevelClicked = function (l) {
      if (vm.torrentRLevel === l) {
        vm.torrentRLevel = 'none';
      } else {
        vm.torrentRLevel = l;
      }
      vm.torrentBuildPager();
    };

    /**
     * onMoreTagsClicked
     */
    vm.onMoreTagsClicked = function () {
      var e = $('.more-tags');
      var i = $('#more-tags-icon');

      if (!e.hasClass('panel-collapsed')) {
        e.slideUp();
        e.addClass('panel-collapsed');
        i.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
      } else {
        e.slideDown();
        e.removeClass('panel-collapsed');
        i.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
      }
    };

    /**
     * toggleHnR
     */
    vm.toggleHnR = function (item) {
      var dt = new TorrentsService(item);
      dt.$toggleHnRStatus(function (res) {
        vm.torrentPagedItems[vm.torrentPagedItems.indexOf(item)] = res;
        NotifycationService.showSuccessNotify('TORRENT_TOGGLE_HNR_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'TORRENT_TOGGLE_HNR_FAILED');
      });
    };

    /**
     * toggleVIP
     */
    vm.toggleVIP = function (item) {
      var dt = new TorrentsService(item);
      dt.$toggleVIPStatus(function (res) {
        vm.torrentPagedItems[vm.torrentPagedItems.indexOf(item)] = res;
        NotifycationService.showSuccessNotify('TORRENT_TOGGLE_VIP_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'TORRENT_TOGGLE_VIP_FAILED');
      });
    };

    /**
     * deleteTorrent
     */
    vm.deleteTorrent = function (item) {
      var modalOptions = {
        closeButtonText: $translate.instant('TORRENT_DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('TORRENT_DELETE_CONFIRM_OK'),
        headerText: $translate.instant('TORRENT_DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('TORRENT_DELETE_CONFIRM_BODY_TEXT'),
        bodyParams: item.torrent_filename
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          var dt = new TorrentsService(item);
          dt.$remove(function (response) {
            successCallback(response);
          }, function (errorResponse) {
            errorCallback(errorResponse);
          });

          function successCallback(res) {
            vm.torrentPagedItems.splice(vm.torrentPagedItems.indexOf(item), 1);
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_DELETE_SUCCESSFULLY')
            });
          }

          function errorCallback(res) {
            vm.error_msg = res.data.message;
            Notification.error({
              message: res.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_DELETE_ERROR')
            });
          }
        });
    };


    /**
     * setSaleType
     */
    vm.setSaleType = function (item, st) {
      TorrentsService.setSaleType({
        _torrentId: item._id,
        _saleType: st.name
      }, function (res) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_SETSALETYPE_SUCCESSFULLY')
        });

        vm.torrentPagedItems[vm.torrentPagedItems.indexOf(item)] = res;
      }, function (res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_SETSALETYPE_ERROR')
        });
      });
    };

    /**
     * vm.setRecommendLevel
     */
    vm.setRecommendLevel = function (item, rl) {
      TorrentsService.setRecommendLevel({
        _torrentId: item._id,
        _rlevel: rl.value
      }, function (res) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_SETRLEVEL_SUCCESSFULLY')
        });

        vm.torrentPagedItems[vm.torrentPagedItems.indexOf(item)] = res;
      }, function (res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_SETRLEVEL_ERROR')
        });
      });
    };

    /**
     * reviewedTorrentStatus
     * @param item
     */
    vm.reviewedTorrentStatus = function (item) {
      TorrentsService.setReviewedStatus({
        _torrentId: item._id
      }, function (res) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENT_SETREVIEWED_SUCCESSFULLY')
        });

        vm.torrentPagedItems[vm.torrentPagedItems.indexOf(item)] = res;
      }, function (res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_SETREVIEWED_ERROR')
        });
      });
    };
  }
}());
