(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsSearchResultController', ForumsSearchResultController);

  ForumsSearchResultController.$inject = ['$scope', '$state', '$timeout', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'marked', 'NotifycationService'];

  function ForumsSearchResultController($scope, $state, $timeout, Authentication, MeanTorrentConfig, ForumsService, marked, NotifycationService) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.user = Authentication.user;

    /**
     * buildPager
     * pagination init
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.topics_search_per_page;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.doSearch(vm.currentPage, function (items) {
        console.log(items);
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (callback) callback();
      });
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_search_list');

      vm.figureOutItemsToDisplay(function () {
        $timeout(function () {
          $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
        }, 10);
      });
    };

    /**
     * doSearch
     * @param p
     * @param callback
     */
    vm.doSearch = function (p, callback) {
      var fs = new ForumsService({
        forumId: $state.params.forumId || undefined,
        keys: $state.params.keys,
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage
      });

      console.log(fs);

      fs.$search(function (res) {
        callback(res);
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.TOPIC_SEARCH_FAILED');
      });
    };
  }
}());
