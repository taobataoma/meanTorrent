(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', '$stateParams', '$translate', 'Authentication', 'menuService', 'MeanTorrentConfig', 'localStorageService',
    'ScoreLevelService', 'InvitationsService', '$interval', 'MessagesService', 'TorrentsService', 'UsersService', 'DebugConsoleService'];

  function HeaderController($scope, $state, $stateParams, $translate, Authentication, menuService, MeanTorrentConfig, localStorageService, ScoreLevelService,
                            InvitationsService, $interval, MessagesService, TorrentsService, UsersService, mtDebug) {
    var vm = this;
    vm.user = Authentication.user;
    vm.language = MeanTorrentConfig.meanTorrentConfig.language;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.messageConfig = MeanTorrentConfig.meanTorrentConfig.messages;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.messagesMenu = menuService.getMenu('mt-message').items[0];
    vm.statusMenu = menuService.getMenu('mt-user').items[0];
    vm.scoreMenu = menuService.getMenu('mt-user').items[1];
    vm.inviteMenu = menuService.getMenu('mt-invite').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.scoreLevelData = vm.user ? ScoreLevelService.getScoreLevelJson(vm.user.score) : undefined;

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    /**
     * auth-user-changed
     */
    $scope.$on('auth-user-changed', function (event, args) {
      vm.user = Authentication.user;
      vm.scoreLevelData = vm.user ? ScoreLevelService.getScoreLevelJson(vm.user.score) : undefined;
    });

    /**
     * user-invitations-changed
     */
    $scope.$on('user-invitations-changed', function (event, args) {
      vm.getInvitationsCount();
    });

    /**
     * user-hnr-warnings-changed
     */
    $scope.$on('user-hnr-warnings-changed', function (event, args) {
      vm.getWarning();
    });

    /**
     * user-unread-count-changed
     */
    $scope.$on('user-unread-count-changed', function (event, args) {
      vm.getCountUnread();
    });

    /**
     * getInvitationsCount
     */
    vm.getInvitationsCount = function () {
      if (Authentication.user) {
        InvitationsService.countInvitations({}, function (res) {
          if (res.countMyInvitations > 0) {
            vm.countMyInvitations = res.countMyInvitations;
          } else {
            vm.countMyInvitations = undefined;
          }
        });
      }
    };

    /**
     * checkMessageUnread
     */
    vm.checkMessageUnread = function () {
      vm.getCountUnread();
      $interval(vm.getCountUnread, vm.messageConfig.checkUnreadInterval);
    };

    vm.getCountUnread = function () {
      if (Authentication.user) {
        MessagesService.countUnread(function (data) {
          vm.unreadCount = data.countFrom + data.countTo + data.countAdmin;
        });
      }
    };

    /**
     * checkHnRWarning
     */
    vm.checkHnRWarning = function () {
      vm.getWarning();
      $interval(vm.getWarning, vm.hnrConfig.checkWaringInterval);
    };

    vm.getWarning = function () {
      if (Authentication.user) {
        UsersService.getUserWarningNumber()
          .then(function (data) {
            vm.user.hnr_warning = Authentication.user.hnr_warning = data.hnr_warning;
          });
      }
    };

    /**
     * stateChangeSuccess
     */
    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

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
        //$state.transitionTo($state.current, $stateParams, {
        //  reload: true, inherit: false, notify: false
        //});
      }
    };

    /**
     * getSiteInfo
     */
    vm.getSiteInfo = function () {
      TorrentsService.siteInfo(function (data) {
        vm.siteInfo = data;
        mtDebug.info(data);
      });
    };
  }
}());
