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
        vm.forum = item;

        vm.forumPath = [
          {name: vm.forum.name, state: 'forums.view', params: {forumId: vm.forum._id}},
          {name: 'Post New Topic', state: undefined}
        ];
      });

    };

    /**
     * postTopic
     * @param isValid
     * @returns {boolean}
     */
    vm.postTopic = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.postForm');
        return false;
      }

      var post = new TopicsService(vm.postFields);
      post._forumId = vm.forum._id;

      post.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.postFields = {};
        $scope.$broadcast('show-errors-reset', 'vm.postForm');
        NotifycationService.showSuccessNotify('POST_SEND_SUCCESSFULLY');

        $state.reload();
      }

      function errorCallback(res) {
        NotifycationService.showErrorNotify(res.data.message, 'POST_SEND_FAILED');
      }
    };

  }
}());
