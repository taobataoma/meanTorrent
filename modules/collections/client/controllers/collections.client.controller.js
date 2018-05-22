(function () {
  'use strict';

  angular
    .module('collections')
    .controller('CollectionController', CollectionController);

  CollectionController.$inject = ['$scope', '$translate', 'getStorageLangService', 'MeanTorrentConfig', 'CollectionsService', 'NotifycationService',
    'DebugConsoleService', '$timeout'];

  function CollectionController($scope, $translate, getStorageLangService, MeanTorrentConfig, CollectionsService, NotifycationService,
                                mtDebug, $timeout) {
    var vm = this;
    vm.lang = getStorageLangService.getLang();
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;

    /**
     * window.resize()
     */
    $(window).resize(function () {
      vm.setAlbumItemHeight();
    });

    /**
     * setAlbumItemHeight
     */
    vm.setAlbumItemHeight = function () {
      $('.collection-item').height($('.collection-item').width() / 1.772);
    };

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.collectionsListPerPage;
      vm.currentPage = 1;

      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.getCollectionsList(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        $timeout(function () {
          vm.setAlbumItemHeight();
        }, 10)

        if (callback) callback();
      });
    };

    /**
     * getCollectionsList
     * @param p
     * @param callback
     */
    vm.getCollectionsList = function (p, callback) {
      CollectionsService.get({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage,
        keys: vm.search
      }, function (data) {
        mtDebug.info(data);
        callback(data);
      }, function (err) {
        NotifycationService.showErrorNotify(err.data.message, 'COLLECTIONS.LIST_ERROR');
      });
    };

    /**
     * getVoteAverage
     * @param c
     * @returns {number}
     */
    vm.getVoteAverage = function (c) {
      var total = 0;
      var count = 0;
      var avg = 0;

      angular.forEach(c.torrents, function (t) {
        total += t.resource_detail_info.vote_average;
        count += 1;
      });
      avg = Math.floor((total / count) * 10) / 10;

      return avg || 0;
    };

    /**
     * getMinMaxRelease
     * @param c
     * @returns {{min: *, max: *}}
     */
    vm.getMinMaxRelease = function (c) {
      var re = [];

      angular.forEach(c.torrents, function (t) {
        re.push(parseInt(t.resource_detail_info.release_date, 10));
      });

      return {
        min: re.length > 0 ? Math.min.apply(null, re) : '',
        max: re.length > 0 ? Math.max.apply(null, re) : ''
      };
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      vm.figureOutItemsToDisplay();
    };
  }
}());
