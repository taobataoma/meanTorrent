(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsViewController', ForumsViewController);

  ForumsViewController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'SideOverlay', '$filter', 'NotifycationService',
    'marked', 'ModalConfirmService', '$stateParams', 'TopicsService'];

  function ForumsViewController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, SideOverlay, $filter, NotifycationService,
                                marked, ModalConfirmService, $stateParams, TopicsService) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;
    vm.forumPath = [];

    /**
     * If user is not signed in then redirect back home
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * init
     */
    vm.init = function () {
      // get forum info by state params
      ForumsService.get({
        forumId: $stateParams.forumId
      }, function (item) {
        vm.forum = item;

        vm.forumPath.push({name: vm.forum.name, state: undefined});
      });

      // get topics list
      TopicsService.query({
        forumId: $stateParams.forumId
      }, function (topics) {
        console.log(topics);
        vm.topics = topics;
      });

    };
  }
}());
