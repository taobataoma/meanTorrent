(function () {
  'use strict';

  angular
    .module('users')
    .controller('ScoreController', ScoreController);

  ScoreController.$inject = ['$rootScope', '$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'ScoreLevelService', 'getStorageLangService',
    'MeanTorrentConfig', 'ModalConfirmService', 'NotifycationService', 'InvitationsService', '$templateRequest', 'marked', '$filter', 'PeersService', 'moment',
    'DebugConsoleService'];

  function ScoreController($rootScope, $scope, $state, $translate, $timeout, Authentication, $window, ScoreLevelService, getStorageLangService, MeanTorrentConfig,
                           ModalConfirmService, NotifycationService, InvitationsService, $templateRequest, marked, $filter, PeersService, moment,
                           mtDebug) {
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
        bodyText: $translate.instant('EXCHANGE_INVITATION_CONFIRM_BODY_TEXT', {
          score: vm.inviteConfig.scoreExchange,
          hours: vm.inviteConfig.expires_str
        })
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

    /**
     * getMyPeers
     */
    vm.getMyPeers = function () {
      PeersService.getMyPeers(function (items) {
        vm.myPeers = items;
        mtDebug.info(items);

        vm.countByStatus = $filter('countBy')(vm.myPeers, 'peer_status');
        vm.groupByStatus = $filter('groupBy')(vm.myPeers, 'peer_status');

        vm.sumCUSpeed = vm.myPeers.map(function (x) {
          return x.peer_cuspeed;
        }).reduce(function (a, b) {
          return a + b;
        });
        vm.sumCDSpeed = vm.myPeers.map(function (x) {
          return x.peer_cdspeed;
        }).reduce(function (a, b) {
          return a + b;
        });
      });
    };

    /**
     * getMarkedCurrDownloadingString
     * @returns {*}
     */
    vm.getMarkedCurrDownloadingString = function () {
      if (vm.countByStatus) {
        var tmp = $translate.instant('CURR_LEECHING_TORRENTS', {count_leech: vm.countByStatus.leecher || 0});
        return marked(tmp, {sanitize: false});
      }
    };

    /**
     * getMarkedCurrSeedingString
     * @returns {*}
     */
    vm.getMarkedCurrSeedingString = function () {
      if (vm.countByStatus) {
        var tmp = $translate.instant('CURR_SEEDING_TORRENTS', {count_seed: vm.countByStatus.seeder || 0});
        return marked(tmp, {sanitize: false});
      }
    };

    /**
     * getMarkedVipStatusString
     * @returns {*}
     */
    vm.getMarkedVipStatusString = function () {
      var tmp = $translate.instant('CURR_VIP_STATE', {vip_status: vm.user.isVip ? 'VALUE_TRUE' : 'VALUE_FALSE'});
      return marked(tmp, {sanitize: false});
    };

    /**
     * getMarkedCurrUpSpeedString
     * @returns {*}
     */
    vm.getMarkedCurrUpSpeedString = function () {
      var tmp = $translate.instant('CURR_UP_TOTAL_SPEED', {up_speed: vm.sumCUSpeed});
      return marked(tmp, {sanitize: false});
    };

    /**
     * getMarkedCurrDownSpeedString
     * @returns {*}
     */
    vm.getMarkedCurrDownSpeedString = function () {
      var tmp = $translate.instant('CURR_DOWN_TOTAL_SPEED', {down_speed: vm.sumCDSpeed});
      return marked(tmp, {sanitize: false});
    };

    /**
     * getMarkedCurrScoreString
     * @returns {*}
     */
    vm.getMarkedCurrScoreString = function () {
      var timedScore = getTimedScore();
      var speedScore = getSpeedScore();
      var seedScoreTotal = timedScore + speedScore;

      seedScoreTotal = Math.round(seedScoreTotal * 100) / 100;

      var tmp = $translate.instant('CURR_SCORE_INCOME_HOURS', {score_hour: seedScoreTotal});
      return marked(tmp, {sanitize: false});
    };

    /**
     * getTimedScore
     * @returns {number}
     */
    function getTimedScore() {
      var timedScore = 0;
      var action = vm.scoreConfig.action.seedTimed;
      var slAction = vm.scoreConfig.action.seedSeederAndLife;

      if (action.enable && vm.groupByStatus) {
        angular.forEach(vm.groupByStatus.seeder, function (seed) {
          if (seed.torrent.torrent_status === 'reviewed') {
            var seedUnit = (60 * 60 * 1000) / action.additionTime;
            var seedScore = seedUnit * action.timedValue;

            if (seedScore > 0) {
              //vip addition
              if (action.vipRatio && vm.user.isVip) {
                seedScore = seedScore * action.vipRatio;
              }

              if (slAction.enable) {
                //torrent seeders count addition
                if (seed.torrent.torrent_seeds <= slAction.seederCount) {
                  var seederUnit = slAction.seederBasicRatio + slAction.seederCoefficient * (slAction.seederCount - seed.torrent.torrent_seeds + 1);
                  seedScore = seedScore * seederUnit;
                }

                //torrent life addition
                var life = moment(Date.now()) - moment(seed.torrent.createdat);
                var days = life / (60 * 60 * 1000 * 24);
                var lifeUnit = slAction.lifeBasicRatio + slAction.lifeCoefficientOfDay * days;

                lifeUnit = lifeUnit > slAction.lifeMaxRatio ? slAction.lifeMaxRatio : lifeUnit;
                seedScore = seedScore * lifeUnit;
              }
            }
            timedScore = timedScore + seedScore;
          }
        });
      }

      return timedScore;
    }

    /**
     * getSpeedScore
     * @returns {number}
     */
    function getSpeedScore() {
      var totalScore = 0;

      var action = vm.scoreConfig.action.seedUpDownload;
      var slAction = vm.scoreConfig.action.seedSeederAndLife;

      if (action.enable && vm.myPeers) {
        angular.forEach(vm.myPeers, function (peer) {
          var udScore = 0;
          var upUnitScore = 1;
          var downUnitScore = 1;
          var seederUnit = 1;
          var lifeUnit = 1;

          var usize = peer.peer_cuspeed * 60 * 60;
          var dsize = peer.peer_cdspeed * 60 * 60;
          var uploadScore = 0;
          var downloadScore = 0;

          if (usize > 0 && action.uploadEnable) {
            if (peer.torrent.torrent_size > action.additionSize) {
              upUnitScore = Math.sqrt(peer.torrent.torrent_size / action.additionSize);
            }
            var upScore = usize / action.perlSize;
            uploadScore = upUnitScore * action.uploadValue * upScore;
            //uploader addition
            if (vm.user._id == peer.torrent.user) {
              uploadScore = uploadScore * action.uploaderRatio;
            }
          }

          if (dsize > 0 && action.downloadEnable) {
            if (peer.torrent.torrent_size > action.additionSize) {
              downUnitScore = Math.sqrt(peer.torrent.torrent_size / action.additionSize);
            }
            var downScore = dsize / action.perlSize;
            downloadScore = downUnitScore * action.downloadValue * downScore;
          }

          udScore = uploadScore + downloadScore;

          if (udScore > 0) {
            //vip addition
            if (action.vipRatio && vm.user.isVip) {
              udScore = udScore * action.vipRatio;
            }

            if (slAction.enable) {
              //torrent seeders count addition
              if (peer.torrent.torrent_seeds <= slAction.seederCount) {
                seederUnit = slAction.seederBasicRatio + slAction.seederCoefficient * (slAction.seederCount - peer.torrent.torrent_seeds + 1);
                udScore = udScore * seederUnit;
              }

              //torrent life addition
              var life = moment(Date.now()) - moment(peer.torrent.createdat);
              var days = life / (60 * 60 * 1000 * 24);
              lifeUnit = slAction.lifeBasicRatio + slAction.lifeCoefficientOfDay * days;

              lifeUnit = lifeUnit > slAction.lifeMaxRatio ? slAction.lifeMaxRatio : lifeUnit;
              udScore = udScore * lifeUnit;
            }

          }
          totalScore = totalScore + udScore;
        });
      }
      return totalScore;
    }
  }
}());
