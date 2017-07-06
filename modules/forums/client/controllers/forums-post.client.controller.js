(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsPostController', ForumsPostController);

  ForumsPostController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'SideOverlay', '$filter', 'NotifycationService',
    'marked', 'ModalConfirmService', '$stateParams', 'TopicsService'];

  function ForumsPostController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, SideOverlay, $filter, NotifycationService,
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
          {name: vm.forum.name, state: 'forums.view', params: {forumId: vm.forum._id}},
          {name: 'Post New Topic', state: undefined}
        ];
      });

    };
  }
}());
