(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsSearchController', ForumsSearchController);

  ForumsSearchController.$inject = ['$scope', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'marked'];

  function ForumsSearchController($scope, $translate, Authentication, MeanTorrentConfig, ForumsService, marked) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;

    vm.forumList = [];
    vm.selectedForum = {};
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

        var cat = '';
        angular.forEach(vm.forums, function (f) {
          vm.forumList.push({
            _id: f._id,
            name: f.name,
            divider: f.category !== cat ? true : false
          });
          cat = f.category;
        });

        vm.selectedForum = vm.forumList[0];
      });
    };

    /**
     * doSearch
     */
    vm.doSearch = function () {
      console.log(vm.selectedForum);
    };
  }
}());
