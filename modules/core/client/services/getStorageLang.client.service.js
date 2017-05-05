(function (app) {
  'use strict';

  angular
    .module(app.applicationModuleName)
    .provider('getStorageLangService', getStorageLangService);

  function getStorageLangService() {
    this.$get = ['localStorageService', function (localStorageService) {
      var getLang = function () {
        var user_lang = navigator.language || navigator.userLanguage;
        user_lang = user_lang.substr(0, 2) || 'en';

        var storage_lang = localStorageService.get('storage_user_lang');
        user_lang = storage_lang || user_lang;

        return user_lang;
      };

      return {
        getLang: getLang
      };
    }];
  }
}(ApplicationConfiguration));
