(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsController', ForumsController);

  ForumsController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'localStorageService', '$filter', 'NotifycationService',
    'marked', 'ModalConfirmService'];

  function ForumsController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, localStorageService, $filter, NotifycationService,
                            marked, ModalConfirmService) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;

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
      vm.last_leave_time = localStorageService.get('last_leave_time') || Date.now();

      // get forums list
      ForumsService.query({}, function (items) {
        console.log(items);
        vm.forums = items;
      });
    };

    /**
     * getForumDesc
     * @param f: forum
     * @returns {*}
     */
    vm.getForumDesc = function (f) {
      if (f) {
        return marked(f.desc, {sanitize: true});
      }
    };

    /**
     * hasNewReply
     * @param t
     * @returns {boolean}
     */
    vm.hasNewReply = function (t) {
      if (t && t.lastReplyAt) {
        var t_reply = moment.utc(t.lastReplyAt).valueOf();
        var t_leave = moment.utc(vm.last_leave_time).valueOf();

        return t_reply > t_leave;
      } else {
        return false;
      }
    };

  }
}());
