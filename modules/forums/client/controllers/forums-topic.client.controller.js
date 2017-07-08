(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsTopicController', ForumsTopicController);

  ForumsTopicController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'ScoreLevelService', '$filter', 'NotifycationService',
    'marked', 'ModalConfirmService', '$stateParams', 'TopicsService', 'localStorageService', '$compile'];

  function ForumsTopicController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, ScoreLevelService, $filter, NotifycationService,
                                 marked, ModalConfirmService, $stateParams, TopicsService, localStorageService, $compile) {
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

    /**
     * getUserScoreLevel
     * @param u
     * @returns {*|l}
     */
    vm.getUserScoreLevel = function (u) {
      var s = ScoreLevelService.getScoreLevelJson(vm.user.score);
      return s.currLevel;
    };

    /**
     * isTopicOwner
     * @param t
     * @returns {boolean}
     */
    vm.isTopicOwner = function (t) {
      if (t.user._id.str === vm.user._id) {
        return true;
      } else {
        return false;
      }
    };

    /**
     * canEditTopic
     * @param t
     * @returns {boolean}
     */
    vm.canEditTopic = function (t) {
      if (vm.isTopicOwner(t) || vm.user.isOper) {
        return true;
      } else {
        return false;
      }
    };

    /**
     * beginEditReply
     * @param t
     */
    vm.beginEditReply = function (t) {
      var el = $('#' + t._id);

      el.markdown({
        autofocus: true,
        savable: true,
        hideable: true,
        iconlibrary: 'fa',
        resize: 'vertical',
        language: localStorageService.get('storage_user_lang'),
        fullscreen: {enable: false},
        onSave: function (e) {
          if (e.isDirty()) {
            //save content
            t.content = e.getContent();
            t.$update(function (res) {
              vm.topic = res;
              NotifycationService.showSuccessNotify('FORUMS.REPLY_EDIT_SUCCESSFULLY');
            }, function (res) {
              NotifycationService.showErrorNotify(res.data.message, 'FORUMS.REPLY_EDIT_FAILED');
            });

            e.$options.hideable = true;
            e.blur();
          } else {
            e.$options.hideable = true;
            e.blur();
          }
        },
        onChange: function (e) {
          e.$options.hideable = false;
        },
        onShow: function (e) {
          e.setContent(t.content);

          $('.md-footer').addClass('text-right');
          $('.md-footer')[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-success margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
          cbtn.bind('click', function (evt) {
            e.$options.hideable = true;
            e.blur();
          });
          $('.md-footer').append(cbtn);
          $compile($('.md-footer').contents())($scope);
        }
      });
    };
  }
}());
