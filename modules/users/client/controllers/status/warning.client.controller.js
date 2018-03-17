(function () {
  'use strict';

  angular
    .module('users')
    .controller('WarningController', WarningController);

  WarningController.$inject = ['$rootScope', '$state', '$translate', '$timeout', 'Authentication', 'Notification', 'PeersService', 'CompleteService',
    'MeanTorrentConfig', '$window', '$filter', 'DownloadService', 'NotifycationService', 'ModalConfirmService', 'getStorageLangService', 'DebugConsoleService',
    'TorrentGetInfoServices', 'ResourcesTagsServices', '$templateRequest', 'marked'];

  function WarningController($rootScope, $state, $translate, $timeout, Authentication, Notification, PeersService, CompleteService, MeanTorrentConfig,
                             $window, $filter, DownloadService, NotifycationService, ModalConfirmService, getStorageLangService, mtDebug,
                             TorrentGetInfoServices, ResourcesTagsServices, $templateRequest, marked) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = Authentication.user;
    vm.RTS = ResourcesTagsServices;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.scoreConfig = MeanTorrentConfig.meanTorrentConfig.score;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.rssConfig = MeanTorrentConfig.meanTorrentConfig.rss;
    vm.ircConfig = MeanTorrentConfig.meanTorrentConfig.ircAnnounce;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.inviteConfig = MeanTorrentConfig.meanTorrentConfig.invite;
    vm.requestsConfig = MeanTorrentConfig.meanTorrentConfig.requests;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.lang = getStorageLangService.getLang();

    vm.searchTags = [];

    /**
     * getTemplateFileContent
     * @param file
     */
    vm.getTemplateFileContent = function (file) {
      $templateRequest(file, true).then(function (response) {
        vm.templateFileContent = response;
      });
    };

    /**
     * getTemplateMarkedContent
     * @returns {*}
     */
    vm.getTemplateMarkedContent = function () {
      var tmp = $filter('fmt')(vm.templateFileContent, {
        appConfig: vm.appConfig,
        announceConfig: vm.announce,
        scoreConfig: vm.scoreConfig,
        rssConfig: vm.rssConfig,
        ircConfig: vm.ircConfig,
        signConfig: vm.signConfig,
        inviteConfig: vm.inviteConfig,
        requestsConfig: vm.requestsConfig,
        hnrConfig: vm.hnrConfig,
        tmdbConfig: vm.tmdbConfig,

        user: vm.user
      });
      return marked(tmp, {sanitize: false});
    };

    /**
     * getWarningTorrent
     */
    vm.getWarningTorrent = function () {
      PeersService.getMyWarningList(function (items) {
        vm.warningList = items;
        mtDebug.info(items);
        for (var i = items.length - 1; i >= 0; i--) {
          if (!items[i].torrent) {
            items.splice(i, 1);
          }
        }
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('WARNING_LIST_ERROR')
        });
      });
    };

    /**
     * removeWarning
     * @param comp
     */
    vm.removeWarning = function (comp) {
      var modalOptions = {
        closeButtonText: $translate.instant('REMOVE_WARNING_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('REMOVE_WARNING_CONFIRM_OK'),
        headerText: $translate.instant('REMOVE_WARNING_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('REMOVE_WARNING_CONFIRM_BODY_TEXT', {score: vm.hnrConfig.scoreToRemoveWarning})
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          if (vm.user.score >= vm.hnrConfig.scoreToRemoveWarning) {
            CompleteService.update({
              completeId: comp._id
            }, function (response) {
              successCallback(response);
            }, function (errorResponse) {
              errorCallback(errorResponse);
            });

          } else {
            NotifycationService.showErrorNotify($translate.instant('REMOVE_WARNING_NO_ENOUGH_SCORE'), 'REMOVE_WARNING_ERROR');
          }

          function successCallback(res) {
            vm.warningList.splice(vm.warningList.indexOf(comp), 1);
            $rootScope.$broadcast('user-hnr-warnings-changed');
            NotifycationService.showSuccessNotify('REMOVE_WARNING_SUCCESSFULLY');
          }

          function errorCallback(res) {
            NotifycationService.showErrorNotify(res.data.message, 'REMOVE_WARNING_ERROR');
          }
        });

    };
  }
}());
