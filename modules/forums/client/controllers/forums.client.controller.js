(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsController', ForumsController);

  ForumsController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'SideOverlay', '$filter', 'NotifycationService',
    'marked', 'ModalConfirmService'];

  function ForumsController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, SideOverlay, $filter, NotifycationService,
                            marked, ModalConfirmService) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;

    /**
     * init
     */
    vm.init = function () {
      ForumsService.query({}, function (items) {
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

  }
}());
