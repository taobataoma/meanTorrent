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

    /**
     * init
     */
    vm.init = function () {
      // get forum info by state params
      ForumsService.get({
        forumId: $stateParams.forumId
      }, function (item) {
        console.log(item);
        vm.forum = item;

        vm.forumPath = [
          {name: vm.forum.name, state: undefined}
        ];
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
