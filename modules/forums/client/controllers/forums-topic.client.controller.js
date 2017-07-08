(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsTopicController', ForumsTopicController);

  ForumsTopicController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'SideOverlay', '$filter', 'NotifycationService',
    'marked', 'ModalConfirmService', '$stateParams', 'TopicsService'];

  function ForumsTopicController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, SideOverlay, $filter, NotifycationService,
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
      });

      // get topics
      TopicsService.get({
        forumId: $stateParams.forumId,
        topicId: $stateParams.topicId
      }, function (topic) {
        console.log(topic);
        vm.topic = topic;

        vm.forumPath.push({name: topic.title, state: undefined});
      });

    };

    /**
     * getTopicContent
     * @param t
     * @returns {*}
     */
    vm.getTopicContent = function (t) {
      if (t) {
        return marked(t.content, {sanitize: true});
      }
    };
  }
}());
