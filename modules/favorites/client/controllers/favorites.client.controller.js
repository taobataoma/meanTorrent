(function () {
  'use strict';

  angular
    .module('favorites')
    .controller('FavoritesController', FavoritesController);

  FavoritesController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$translate', 'MeanTorrentConfig', 'MedalsService', 'NotifycationService', 'DebugConsoleService',
    '$timeout', 'MedalsInfoServices', 'localStorageService', 'marked', 'MiddleDataServices', 'Authentication', 'FavoritesService'];

  function FavoritesController($scope, $rootScope, $state, $stateParams, $translate, MeanTorrentConfig, MedalsService, NotifycationService, mtDebug,
                               $timeout, MedalsInfoServices, localStorageService, marked, MiddleDataServices, Authentication, FavoritesService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.homeConfig = MeanTorrentConfig.meanTorrentConfig.home;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.rssConfig = MeanTorrentConfig.meanTorrentConfig.rss;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;

    vm.searchTags = [];

    /**
     * initTopBackground
     */
    vm.initTopBackground = function () {
      var url = localStorageService.get('body_background_image') || vm.homeConfig.bodyBackgroundImage;
      $('.backdrop').css('backgroundImage', 'url("' + url + '")');
    };

    /**
     * buildPager
     * pagination init
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.torrentsFavoritesPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.resultMsg = 'FAVORITES.FAVORITES_IS_LOADING';
      vm.getMyFavorites(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (vm.pagedItems.length === 0) {
          if (vm.currentPage > 1) {
            vm.currentPage -= 1;
            vm.pageChanged();
          } else {
            vm.resultMsg = 'FAVORITES.FAVORITES_IS_EMPTY';
          }
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
      var element = angular.element('#top_of_favorites_list');

      vm.figureOutItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop - 40}, 200);
        }, 10);
      });
    };

    /**
     * getMyFavorites
     * @param p
     * @param callback
     */
    vm.getMyFavorites = function (p, callback) {
      FavoritesService.query({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage
      }, function (res) {
        callback(res);
      });
    };

    /**
     * getFavoritesOverviewContent
     * @returns {*}
     */
    vm.getFavoritesOverviewContent = function () {
      var ts = $translate.instant('FAVORITES.DESC', {
        rssNumber: vm.rssConfig.pageItemsNumber
      });

      return marked(ts, {sanitize: false});
    };

    /**
     * makeRSSAddress
     */
    vm.makeRSSAddress = function () {
      //make rss url
      vm.rssUrl = vm.appConfig.domain;
      vm.rssUrl += '/api/rss';
      vm.rssUrl += '/' + vm.user.passkey;
      vm.rssUrl += '?language=' + localStorageService.get('storage_user_lang');
      vm.rssUrl += '&limit=' + vm.rssConfig.pageItemsNumber;
      vm.rssUrl += '&favorite=true';
    };
  }
}());
