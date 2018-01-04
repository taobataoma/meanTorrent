(function () {
  'use strict';

  angular
    .module('users')
    .controller('FollowController', FollowController);

  FollowController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'UsersService', 'ScoreLevelService', 'MeanTorrentConfig', 'ModalConfirmService',
    'NotifycationService'];

  function FollowController($scope, $state, $timeout, $translate, Authentication, UsersService, ScoreLevelService, MeanTorrentConfig, ModalConfirmService,
                            NotifycationService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);

  }
}());
