(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsUploadsController', TorrentsUploadsController);

  TorrentsUploadsController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'AnnounceConfig'];

  function TorrentsUploadsController($scope, $state, $translate, Authentication, AnnounceConfig) {
    var vm = this;
    vm.announce = AnnounceConfig.announce;
    vm.rule_items = [];

    for (var i = 0; i < $translate.instant('UPLOADS_RULES_COUNT'); i++) {
      vm.rule_items[i] = i;
    }

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

  }
}());
