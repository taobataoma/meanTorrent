(function (app) {
  'use strict';

  angular
    .module(app.applicationModuleName)
    .provider('getStorageLangService', getStorageLangService);

  function getStorageLangService() {
    this.$get = ['localStorageService', 'MeanTorrentConfig', function (localStorageService, MeanTorrentConfig) {
      var getLang = function () {
        var user_lang = navigator.language || navigator.userLanguage;
        user_lang = user_lang.substr(0, 2) || 'en';

        var storage_lang = localStorageService.get('storage_user_lang');
        user_lang = storage_lang || user_lang;

        var lang_list = MeanTorrentConfig.meanTorrentConfig.language;
        var inlist = false;
        angular.forEach(lang_list, function (l) {
          if (l.name === user_lang) {
            inlist = true;
          }
        });

        if (!inlist) {
          user_lang = 'en';
        }

        return user_lang;
      };

      return {
        getLang: getLang
      };
    }];
  }
}(ApplicationConfiguration));
