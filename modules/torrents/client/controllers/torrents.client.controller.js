(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsController', TorrentsController);

  TorrentsController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'Notification', 'TorrentsService',
    'MeanTorrentConfig', 'DownloadService', '$window', 'ScrapeService'];

  function TorrentsController($scope, $state, $translate, $timeout, Authentication, Notification, TorrentsService, MeanTorrentConfig,
                              DownloadService, $window, ScrapeService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.scrapeConfig = MeanTorrentConfig.meanTorrentConfig.scrapeTorrentStatus;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.imdbConfig = MeanTorrentConfig.meanTorrentConfig.imdbConfig;
    vm.resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;
    vm.torrentSalesType = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

    vm.searchTags = [];
    vm.searchKey = '';
    vm.releaseYear = undefined;
    vm.filterHnR = false;
    vm.topItems = 6;

    vm.torrentType = $state.current.data.torrentType;

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * commentBuildPager
     * pagination init
     */
    vm.torrentBuildPager = function () {
      vm.torrentPagedItems = [];
      vm.torrentItemsPerPage = vm.itemsPerPageConfig.torrentsPerPage;
      vm.torrentCurrentPage = 1;
      vm.torrentFigureOutItemsToDisplay();
    };

    /**
     * torrentFigureOutItemsToDisplay
     * @param callback
     */
    vm.torrentFigureOutItemsToDisplay = function (callback) {
      vm.getResourcePageInfo(vm.torrentCurrentPage, function (items) {
        vm.torrentFilterLength = items.total - vm.topItems;
        vm.torrentPagedItems = items.rows;

        if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInList) {
          ScrapeService.scrapeTorrent(vm.torrentPagedItems);
        }

        if (callback) callback();
      });
    };

    /**
     * torrentPageChanged
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
     * getResourceTopInfo
     */
    vm.getResourceTopInfo = function () {
      TorrentsService.get({
        limit: vm.topItems,
        torrent_status: 'reviewed',
        torrent_type: vm.torrentType
      }, function (items) {
        vm.listTopInfo = items.rows;

        if (!vm.announce.privateTorrentCmsMode && vm.scrapeConfig.onTorrentInList) {
          ScrapeService.scrapeTorrent(vm.listTopInfo);
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TOP_LIST_INFO_ERROR')
        });
      });
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
     * getResourcePageInfo
     * @param p: page number
     */
    vm.getResourcePageInfo = function (p, callback) {
      //if searchKey or searchTags has value, the skip=0
      var skip = vm.topItems;
      if (vm.searchKey.trim().length > 0 || vm.searchTags.length > 0 || vm.releaseYear || vm.filterHnR) {
        skip = 0;
      }

      TorrentsService.get({
        skip: (p - 1) * vm.torrentItemsPerPage + skip,
        limit: vm.torrentItemsPerPage,
        keys: vm.searchKey.trim(),
        torrent_status: 'reviewed',
        torrent_type: vm.torrentType,
        torrent_release: vm.releaseYear,
        torrent_tags: vm.searchTags,
        torrent_hnr: vm.filterHnR
      }, function (items) {
        if (items.length === 0) {
          Notification.error({
            message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('LIST_PAGE_INFO_EMPTY')
          });
        } else {
          callback(items);
          console.log(items);
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('LIST_PAGE_INFO_ERROR')
        });
      });
    };

    /**
     * getTagTitle
     * @param tag: tag name
     * @returns {*}
     */
    vm.getTagTitle = function (tag) {
      var tmp = tag;
      var find = false;

      angular.forEach(vm.resourcesTags.radio, function (item) {
        angular.forEach(item.value, function (sitem) {
          if (sitem.name === tag) {
            tmp = item.name;
            find = true;
          }
        });
      });

      if (!find) {
        angular.forEach(vm.resourcesTags.checkbox, function (item) {
          angular.forEach(item.value, function (sitem) {
            if (sitem.name === tag) {
              tmp = item.name;
            }
          });
        });
      }
      return tmp;
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
     * onHnRClicked
     */
    vm.onHnRClicked = function () {
      vm.filterHnR = !vm.filterHnR;
      vm.torrentBuildPager();
    };
    vm.onHnRChanged = function () {
      vm.torrentBuildPager();
    };

    /**
     * getSaleTypeDesc
     */
    vm.getSaleTypeDesc = function (item) {
      var desc = '';

      angular.forEach(vm.torrentSalesType.value, function (st) {
        if (st.name === item.torrent_sale_status) {
          desc = st.desc;
        }
      });
      return desc;
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
     * downloadTorrent
     * @param id
     */
    vm.downloadTorrent = function (id) {
      var url = '/api/torrents/download/' + id;
      DownloadService.downloadFile(url, null, function (status) {
        if (status === 200) {
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENTS_DOWNLOAD_SUCCESSFULLY')
          });
        }
      }, function (err) {
        Notification.error({
          title: 'ERROR',
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENT_DOWNLOAD_ERROR')
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
  }
}());
