(function () {
  'use strict';

  angular.module('core')
    .directive('torrentListItem', torrentListItem);

  function torrentListItem() {
    var TorrentsItemController = ['$scope', '$rootScope', '$state', 'TorrentGetInfoServices', 'ResourcesTagsServices', '$timeout', 'DownloadService', 'MeanTorrentConfig',
      'TorrentsService', 'Authentication', 'NotifycationService', 'ModalConfirmService', '$translate', 'moment', 'FavoritesService',
      function ($scope, $rootScope, $state, TorrentGetInfoServices, ResourcesTagsServices, $timeout, DownloadService, MeanTorrentConfig, TorrentsService, Authentication,
                NotifycationService, ModalConfirmService, $translate, moment, FavoritesService) {
        var vm = this;

        vm.user = Authentication.user;
        vm.state = $state;
        vm.TGI = TorrentGetInfoServices;
        vm.RTS = ResourcesTagsServices;
        vm.DLS = DownloadService;
        vm.torrentSalesType = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
        vm.torrentRLevels = MeanTorrentConfig.meanTorrentConfig.torrentRecommendLevel;
        vm.salesGlobalConfig = MeanTorrentConfig.meanTorrentConfig.torrentGlobalSales;
        vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;

        /**
         * buildPager
         */
        function buildPager() {
          if (typeof $scope.parent.torrentBuildPager === 'function') {
            $scope.parent.torrentBuildPager();
          } else if (typeof $scope.parent.buildPager === 'function') {
            $scope.parent.buildPager();
          }
        }

        /**
         * getTagUsedStatus
         * @param t
         * @returns {boolean}
         */
        vm.getTagUsedStatus = function (t) {
          return $scope.parent.searchTags.indexOf(t) !== -1;
        };

        /**
         * onTagClicked
         * @param tag: tag name
         */
        vm.onTagClicked = function (tag) {
          if ($('#tag_' + tag) && $('#tag_' + tag).val()) {
            $timeout(function () {
              angular.element('#tag_' + tag).trigger('click');
            }, 10);
          } else {
            if ($scope.parent.searchTags.includes(tag)) {
              $scope.parent.searchTags.splice($scope.parent.searchTags.indexOf(tag), 1);
            } else {
              $scope.parent.searchTags.push(tag);
            }
            buildPager();
          }
        };

        /**
         * onReleaseClicked
         * @param y
         */
        vm.onReleaseClicked = function (y) {
          if ($scope.parent.releaseYear === y) {
            $scope.parent.releaseYear = undefined;
          } else {
            $scope.parent.releaseYear = y;
          }

          buildPager();
        };

        /**
         * onTorrentTypeClicked
         * @param t
         */
        vm.onTorrentTypeClicked = function (t) {
          if ($state.current.name.startsWith('admin.torrents')) {
            if ($scope.parent.torrentType === t) {
              $scope.parent.torrentType = 'aggregate';
            } else {
              $scope.parent.torrentType = t;
            }
          } else {
            if ($scope.parent.filterType === t) {
              $scope.parent.filterType = $scope.parent.torrentType;
            } else {
              $scope.parent.filterType = t;
            }
          }

          buildPager();
        };

        /**
         * onRLevelClicked
         * @param y
         */
        vm.onRLevelClicked = function (l) {
          if ($scope.parent.torrentRLevel === l) {
            $scope.parent.torrentRLevel = 'level0';
          } else {
            $scope.parent.torrentRLevel = l;
          }

          buildPager();
        };

        /**
         * onHnRClicked
         */
        vm.onHnRClicked = function () {
          $scope.parent.filterHnR = !$scope.parent.filterHnR;

          buildPager();
        };

        /**
         * onSaleChanged
         */
        vm.onSaleClicked = function () {
          $scope.parent.filterSale = !$scope.parent.filterSale;

          buildPager();
        };

        /**
         * onVIPClicked
         */
        vm.onVIPClicked = function () {
          $scope.parent.filterVIP = !$scope.parent.filterVIP;

          buildPager();
        };

        /**
         * onTopClicked
         */
        vm.onTopClicked = function () {
          $scope.parent.filterTop = !$scope.parent.filterTop;
          buildPager();
        };

        /**
         * onUniqueClicked
         */
        vm.onUniqueClicked = function () {
          $scope.parent.filterUnique = !$scope.parent.filterUnique;
          buildPager();
        };

        /**
         * toggleTop
         */
        vm.toggleTop = function (item) {
          var dt = new TorrentsService(item);
          dt.$toggleTopStatus(function (res) {
            $scope.list[$scope.list.indexOf(item)] = res;
            NotifycationService.showSuccessNotify('TORRENT_TOGGLE_TOP_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'TORRENT_TOGGLE_TOP_FAILED');
          });
        };

        /**
         * toggleTop
         */
        vm.toggleUnique = function (item) {
          var dt = new TorrentsService(item);
          dt.$toggleUniqueStatus(function (res) {
            $scope.list[$scope.list.indexOf(item)] = res;
            NotifycationService.showSuccessNotify('TORRENT_TOGGLE_UNIQUE_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'TORRENT_TOGGLE_UNIQUE_FAILED');
          });
        };

        /**
         * toggleHnR
         */
        vm.toggleHnR = function (item) {
          var dt = new TorrentsService(item);
          dt.$toggleHnRStatus(function (res) {
            $scope.list[$scope.list.indexOf(item)] = res;
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
            $scope.list[$scope.list.indexOf(item)] = res;
            NotifycationService.showSuccessNotify('TORRENT_TOGGLE_VIP_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'TORRENT_TOGGLE_VIP_FAILED');
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
            $scope.list[$scope.list.indexOf(item)] = res;
            NotifycationService.showSuccessNotify('TORRENT_SETRLEVEL_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'TORRENT_SETRLEVEL_ERROR');
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
            $scope.list[$scope.list.indexOf(item)] = res;
            NotifycationService.showSuccessNotify('TORRENT_SETSALETYPE_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'TORRENT_SETSALETYPE_ERROR');
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
            bodyParams: item.torrent_filename,

            selectOptions: {
              enable: true,
              title: 'TORRENT_DELETE_REASON',
              options: [
                'TORRENT_DELETE_REASON_OVERVIEW',
                'TORRENT_DELETE_REASON_NFO',
                'TORRENT_DELETE_REASON_QUALITY',
                'TORRENT_DELETE_REASON_ILLEGAL'
              ]
            }
          };

          ModalConfirmService.showModal({}, modalOptions)
            .then(function (result) {
              var reason = result.reason;
              if (reason === 'CUSTOM') reason = result.custom;

              var dt = new TorrentsService(item);
              dt.$remove({
                reason: reason
              }, function (response) {
                successCallback(response);
              }, function (errorResponse) {
                errorCallback(errorResponse);
              });

              function successCallback(res) {
                $scope.list.splice($scope.list.indexOf(item), 1);
                NotifycationService.showSuccessNotify('TORRENT_DELETE_SUCCESSFULLY');
              }

              function errorCallback(res) {
                NotifycationService.showErrorNotify(res.data.message, 'TORRENT_DELETE_ERROR');
              }
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
            $scope.list[$scope.list.indexOf(item)] = res;
            $rootScope.$broadcast('new-torrents-changed');
            NotifycationService.showSuccessNotify('TORRENT_SETREVIEWED_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'TORRENT_SETREVIEWED_ERROR');
          });
        };

        /**
         * showByLabel
         * @returns {boolean}
         */
        vm.showByLabel = function () {
          if (vm.state.current.name.startsWith('admin.torrents')) {
            return true;
          } else if (vm.state.current.name.indexOf('seeding') > 0) {
            return true;
          } else if (vm.state.current.name.indexOf('leeching') > 0) {
            return true;
          } else if (vm.state.current.name.indexOf('warning') > 0) {
            return true;
          } else if (vm.state.current.name.indexOf('downloading') > 0) {
            return true;
          } else {
            return false;
          }
        };

        /**
         * showByUser
         * @returns {boolean}
         */
        vm.showByUser = function () {
          if (vm.state.current.name.startsWith('admin.torrents')) {
            return false;
          } else if (vm.state.current.name.indexOf('seeding') > 0) {
            return false;
          } else if (vm.state.current.name.indexOf('leeching') > 0) {
            return false;
          } else if (vm.state.current.name.indexOf('warning') > 0) {
            return false;
          } else if (vm.state.current.name.indexOf('downloading') > 0) {
            return false;
          } else if (vm.state.current.name.startsWith('collections')) {
            return false;
          } else if (vm.state.current.name.startsWith('albums')) {
            return false;
          } else if (vm.state.current.name.startsWith('requests')) {
            return false;
          } else {
            return true;
          }
        };

        /**
         * isGlobalSaleNow
         * @returns {boolean}
         */
        vm.isGlobalSaleNow = function () {
          var start = moment(vm.salesGlobalConfig.global.startAt, vm.salesGlobalConfig.global.timeFormats).valueOf();
          var end = start + vm.salesGlobalConfig.global.expires;
          var now = Date.now();

          if (now > start && now < end && vm.salesGlobalConfig.global.value) {
            return true;
          } else {
            return false;
          }
        };

        /**
         * addTorrentToFavorite
         * @param t
         */
        vm.addTorrentToFavorite = function (t) {
          FavoritesService.addTorrent({
            torrentId: t._id
          }, function (res) {
            if ($scope.parent.myFavoritesList) {
              $scope.parent.myFavoritesList.push(res);
            }
            NotifycationService.showSuccessNotify('FAVORITES.ADD_FAVORITE_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'FAVORITES.ADD_FAVORITE_ERROR');
          });
        };

        /**
         * removeTorrentFromFavorite
         * @param item
         */
        vm.removeTorrentFromFavorite = function () {
          FavoritesService.remove({favoriteId: $scope.favoriteItem._id}, function (res) {
            // $scope.parent.figureOutItemsToDisplay();
            $scope.list.splice($scope.list.indexOf($scope.favoriteItem), 1);
            NotifycationService.showSuccessNotify('FAVORITES.REMOVE_FAVORITE_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'FAVORITES.REMOVE_FAVORITE_ERROR');
          });
        };
      }];

    return {
      restrict: 'AE',
      templateUrl: '/modules/torrents/client/templates/torrent-item.client.view.html',
      controller: TorrentsItemController,
      controllerAs: 'vm',
      scope: {
        item: '=',
        list: '=',
        peer: '=',
        warning: '=',
        parent: '=',
        favoriteItem: '='
      }
    };
  }
}());
