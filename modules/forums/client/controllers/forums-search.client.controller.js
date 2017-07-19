(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsSearchController', ForumsSearchController);

  ForumsSearchController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService'];

  function ForumsSearchController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;

    vm.forumList = [];
    vm.selectedForum = {};
    vm.searchKeys = undefined;
    /**
     * init
     */
    vm.init = function () {
      // get forums list
      ForumsService.get({}, function (items) {
        vm.forums = items.forumsList;

        vm.forumList.push({
          _id: undefined,
          name: $translate.instant('FORUMS.ALL_FORUMS'),
          divider: false
        });
        vm.selectedForum = vm.forumList[0];

        var cat = '';
        angular.forEach(vm.forums, function (f) {
          vm.forumList.push({
            _id: f._id,
            name: f.name,
            divider: f.category !== cat ? true : false
          });
          cat = f.category;
        });

        //current forum
        angular.forEach(vm.forumList, function (f) {
          if ($state.params.forumId === f._id) {
            vm.selectedForum = f;
          }
        });
        vm.searchKeys = $state.params.keys || '';
      });
    };

    /**
     * onSearchKeyDown
     * @param evt
     */
    vm.onSearchKeyDown = function (evt) {
      if (evt.keyCode === 13 && vm.searchKeys) {
        vm.routeToSearch();
      }
    };

    /**
     * routeToSearch
     */
    vm.routeToSearch = function () {
      if (vm.searchKeys) {
        $state.go('forums.search', {forumId: vm.selectedForum._id, keys: vm.searchKeys});
      }
    };
  }
}());
