(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsSearchController', ForumsSearchController);

  ForumsSearchController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'DebugConsoleService'];

  function ForumsSearchController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, mtDebug) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
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
          divider: false,
          index: -1,
          show: true
        });
        vm.selectedForum = vm.forumList[0];

        var cat = '';
        angular.forEach(vm.forums, function (f) {
          vm.forumList.push({
            _id: f._id,
            name: f.name,
            divider: f.category !== cat ? true : false,
            index: getIndexByCategory(f.category),
            show: vm.getForumShowedStatus(f)
          });
          cat = f.category;

          //current forum
          if ($state.params.forumId === f._id) {
            vm.selectedForum = f;
          }
        });

        vm.searchKeys = $state.params.keys || '';
      });
    };

    /**
     * getIndexByCategory
     * @param g
     * @returns {number}
     */
    function getIndexByCategory(g) {
      var idx = 999;

      angular.forEach(vm.forumsConfig.category, function (c) {
        if (c.value === g) {
          idx = c.index;
        }
      });

      return idx;
    }

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
        if (!vm.selectedForum._id) {
          var fid = [];

          angular.forEach(vm.forumList, function (f) {
            if (f.show && f._id) {
              fid.push(f._id);
            }
          });

          mtDebug.info(fid);
          $state.go('forums.search', {forumId: fid, keys: vm.searchKeys});
        } else {
          $state.go('forums.search', {forumId: vm.selectedForum._id, keys: vm.searchKeys});
        }
      }
    };

    /**
     * getForumShowedStatus
     * @param f
     * @returns {boolean}
     */
    vm.getForumShowedStatus = function (f) {
      if (vm.user.isOper) {
        return true;
      } else {
        if (f.vipOnly) {
          if (vm.user.isVip) {
            return true;
          } else {
            return false;
          }
        } else if (f.operOnly) {
          return false;
        } else {
          return true;
        }
      }
    };
  }
}());
