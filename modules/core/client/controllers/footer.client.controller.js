(function () {
  'use strict';

  angular
    .module('core')
    .controller('FooterController', FooterController);

  FooterController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'MeanTorrentConfig', 'localStorageService',
    'getStorageLangService', 'TorrentsService'];

  function FooterController($scope, $state, $timeout, $translate, Authentication, MeanTorrentConfig, localStorageService,
                            getStorageLangService, TorrentsService) {
    var vm = this;
    vm.user = Authentication.user;
    vm.langService = getStorageLangService;
    vm.language = MeanTorrentConfig.meanTorrentConfig.language;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;

    /**
     * document.ready()
     */
    $(document).ready(function () {
      $('#warning_popup').popup({
        outline: false,
        focusdelay: 400,
        vertical: 'top',
        autoopen: false,
        opacity: 0.6,
        closetransitionend: function () {
          $('#warning_popup_wrapper').remove();
          $('#warning_popup_background').remove();
        }
      });
    });

    /**
     * auth-user-changed
     */
    $scope.$on('auth-user-changed', function (event, args) {
      vm.user = Authentication.user;
    });

    /**
     * getWarningInfo
     */
    vm.getWarningInfo = function () {
      var sw = localStorageService.get('showed_warning');
      if (!vm.user && vm.appConfig.showDemoWarningPopup && !sw) {
        $timeout(function () {
          $('#warning_popup').popup('show');
        }, 10);

        localStorageService.set('showed_warning', true);
      }
      if (sw) {
        $('#warning_popup_wrapper').remove();
        $('#warning_popup_background').remove();
      }
    };

    /**
     * changeLanguage
     * @param langKey
     */
    vm.changeLanguage = function (langKey) {
      var lang = localStorageService.get('storage_user_lang');
      if (lang !== langKey) {
        localStorageService.set('storage_user_lang', langKey);
        $translate.use(langKey);

        $state.reload();
      }
    };

    /**
     * getSiteInfo
     */
    vm.getSiteInfo = function () {
      TorrentsService.siteInfo(function (data) {
        vm.siteInfo = data;
      });
    };
  }
}());
