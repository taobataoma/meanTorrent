(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsPostController', ForumsPostController);

  ForumsPostController.$inject = ['$scope', '$state', '$window', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'Upload', '$timeout', 'NotifycationService',
    'marked', '$stateParams', 'TopicsService'];

  function ForumsPostController($scope, $state, $window, Authentication, MeanTorrentConfig, ForumsService, Upload, $timeout, NotifycationService,
                                marked, $stateParams, TopicsService) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;
    vm.forumPath = [];

    $('.autocomplete').textcomplete([
      { // emoji strategy
        match: /\B:([\-+\w]*)$/,
        search: function (term, callback) {
          callback($.map(window.emojies, function (emoji) {
            return emoji.indexOf(term) === 0 ? emoji : null;
          }));
        },
        template: function (value) {
          return '<img class="ac-emoji" src="/graphics/emojis/' + value + '.png" />' + '<span class="ac-emoji-text">' + value + '</span>';
        },
        replace: function (value) {
          return ':' + value + ': ';
        },
        index: 1
      }
    ]);

    /**
     * init
     */
    vm.init = function () {
      // get forum info by state params
      ForumsService.get({
        forumId: $stateParams.forumId
      }, function (item) {
        vm.forum = item;

        vm.forumPath.splice(0, 0, {name: vm.forum.name, state: 'forums.view', params: {forumId: vm.forum._id}});
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

      var uf = [];
      angular.forEach($scope.uFiles, function (f) {
        uf.push({
          filename: f.name,
          filesize: f.size
        });
      });

      var uimg = [];
      angular.forEach($scope.uImages, function (f) {
        uimg.push({
          filename: f.name
        });
      });

      var post = new TopicsService(vm.postFields);
      post.forum = vm.forum._id;
      post._attach = uf;
      post._uImage = uimg;

      post.$save(function (response) {
        successCallback(response);
      }, function (errorResponse) {
        errorCallback(errorResponse);
      });

      function successCallback(res) {
        vm.postFields = {};
        $scope.uFiles = [];
        $scope.uImages = [];

        $scope.$broadcast('show-errors-reset', 'vm.postForm');
        NotifycationService.showSuccessNotify('FORUMS.POST_TOPIC_SUCCESSFULLY');
        $state.go('forums.topic', {forumId: vm.forum._id, topicId: res._id});
      }

      function errorCallback(res) {
        NotifycationService.showErrorNotify(res.data.message, 'FORUMS.POST_TOPIC_FAILED');
      }
    };

    /**
     * uploadAttach
     * @param editor
     * @param ufile
     * @param callback
     */
    vm.uploadAttach = function (editor, ufile, progressback, callback, errback) {
      Upload.upload({
        url: '/api/attach/upload',
        data: {
          newAttachFile: ufile
        }
      }).then(function (res) {
        if (callback) {
          callback(res.data.filename);
        }
      }, function (res) {
        if (errback && res.status > 0) {
          errback(res);
        }
      }, function (evt) {
        if (progressback) {
          progressback(parseInt(100.0 * evt.loaded / evt.total, 10));
        }
      });
    };
  }
}());
