(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'menuService', 'MeanTorrentConfig', 'localStorageService'];

  function HeaderController($scope, $state, $translate, Authentication, menuService, MeanTorrentConfig, localStorageService) {
    var vm = this;
    vm.language = MeanTorrentConfig.meanTorrentConfig.language;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    vm.changeLanguage = function (langKey) {
      console.log('langKey=' + langKey);
      localStorageService.set('storage_user_lang', langKey);
      $translate.use(langKey);

      $state.reload();
    };
  }
}());
