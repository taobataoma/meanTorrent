(function () {
  'use strict';

  angular
    .module('users')
    .controller('ScoreController', ScoreController);

  ScoreController.$inject = ['$rootScope', '$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'ScoreLevelService', 'getStorageLangService',
    'MeanTorrentConfig', 'ModalConfirmService', 'NotifycationService', 'InvitationsService', '$templateRequest', 'marked', '$filter'];

  function ScoreController($rootScope, $scope, $state, $translate, $timeout, Authentication, $window, ScoreLevelService, getStorageLangService, MeanTorrentConfig,
                           ModalConfirmService, NotifycationService, InvitationsService, $templateRequest, marked, $filter) {
    var vm = this;
    vm.scoreConfig = MeanTorrentConfig.meanTorrentConfig.score;
    vm.inviteConfig = MeanTorrentConfig.meanTorrentConfig.invite;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.supportConfig = MeanTorrentConfig.meanTorrentConfig.support;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.torrentType = MeanTorrentConfig.meanTorrentConfig.torrentType;
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;
    vm.rssConfig = MeanTorrentConfig.meanTorrentConfig.rss;
    vm.ircConfig = MeanTorrentConfig.meanTorrentConfig.ircAnnounce;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.requestsConfig = MeanTorrentConfig.meanTorrentConfig.requests;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.salesTypeConfig = MeanTorrentConfig.meanTorrentConfig.torrentSalesType;
    vm.salesGlobalConfig = MeanTorrentConfig.meanTorrentConfig.torrentGlobalSales;
    vm.ircAnnounceConfig = MeanTorrentConfig.meanTorrentConfig.ircAnnounce;
    vm.passwordConfig = MeanTorrentConfig.meanTorrentConfig.password;
    vm.examinationConfig = MeanTorrentConfig.meanTorrentConfig.examination;
    vm.chatConfig = MeanTorrentConfig.meanTorrentConfig.chat;
    vm.accessConfig = MeanTorrentConfig.meanTorrentConfig.access;

    vm.lang = getStorageLangService.getLang();
    vm.user = Authentication.user;

    /**
     * auth-user-changed
     */
    $scope.$on('auth-user-changed', function (event, args) {
      vm.user = Authentication.user;
      vm.scoreLevelData = vm.user ? ScoreLevelService.getScoreLevelJson(vm.user.score) : undefined;
    });

    /**
     * getTemplateScoreFileContent
     * @param file
     */
    vm.getTemplateScoreFileContent = function (file) {
      $templateRequest(file, true).then(function (response) {
        vm.templateScoreFileContent = response;
      });
    };

    /**
     * getTemplateLevelFileContent
     * @param file
     */
    vm.getTemplateLevelFileContent = function (file) {
      $templateRequest(file, true).then(function (response) {
        vm.templateLevelFileContent = response;
      });
    };

    /**
     * getTemplateMarkedContent
     * @returns {*}
     */
    vm.getTemplateMarkedContent = function (cnt) {
      var tmp = $filter('fmt')(cnt, {
        appConfig: vm.appConfig,
        supportConfig: vm.supportConfig,
        announceConfig: vm.announceConfig,
        scoreConfig: vm.scoreConfig,
        rssConfig: vm.rssConfig,
        ircConfig: vm.ircConfig,
        signConfig: vm.signConfig,
        inviteConfig: vm.inviteConfig,
        requestsConfig: vm.requestsConfig,
        hnrConfig: vm.hnrConfig,
        tmdbConfig: vm.tmdbConfig,
        salesTypeConfig: vm.salesTypeConfig,
        salesGlobalConfig: vm.salesGlobalConfig,
        ircAnnounceConfig: vm.ircAnnounceConfig,
        passwordConfig: vm.passwordConfig,
        examinationConfig: vm.examinationConfig,
        chatConfig: vm.chatConfig,
        accessConfig: vm.accessConfig,

        user: vm.user
      });

      tmp = $filter('translate')(tmp);

      return marked(tmp, {sanitize: false});
    };

    /**
     * init
     */
    vm.init = function () {
      vm.scoreLevelData = ScoreLevelService.getScoreLevelJson(vm.user.score);
    };

    /**
     * exchangeInvitation
     */
    vm.exchangeInvitation = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('EXCHANGE_INVITATION_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('EXCHANGE_INVITATION_CONFIRM_OK'),
        headerText: $translate.instant('EXCHANGE_INVITATION_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('EXCHANGE_INVITATION_CONFIRM_BODY_TEXT', {score: vm.inviteConfig.scoreExchange, hours: vm.inviteConfig.expires_str})
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          var invitation = new InvitationsService();

          invitation.$save(function (response) {
            successCallback(response);
          }, function (errorResponse) {
            errorCallback(errorResponse);
          });

          function successCallback(res) {
            if (res._id === vm.user._id) {
              vm.user = Authentication.user = res;
              $rootScope.$broadcast('auth-user-changed');
              $rootScope.$broadcast('user-invitations-changed');
            }
            NotifycationService.showSuccessNotify('EXCHANGE_INVITATION_SUCCESSFULLY');
          }

          function errorCallback(res) {
            NotifycationService.showErrorNotify(res.data.message, 'EXCHANGE_INVITATION_ERROR');
          }
        });
    };
  }
}());
