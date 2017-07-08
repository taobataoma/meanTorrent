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

        vm.forumPath.push({name: vm.forum.name, state: 'forums.view', params: {forumId: vm.forum._id}});
        vm.forumPath.push({name: 'Post New Topic', state: undefined});
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
      post.forum = vm.forum._id;

      post.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.postFields = {};
        $scope.$broadcast('show-errors-reset', 'vm.postForm');
        NotifycationService.showSuccessNotify('FORUMS.POST_SEND_SUCCESSFULLY');
        $state.go('forums.view', {forumId: vm.forum._id});
      }

      function errorCallback(res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.POST_SEND_FAILED');
      }
    };

  }
}());
