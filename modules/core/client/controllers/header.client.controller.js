(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', '$timeout', '$translate', 'Authentication', 'menuService', 'MeanTorrentConfig', 'localStorageService',
    'ScoreLevelService', 'InvitationsService', '$interval', 'MessagesService', 'TorrentsService', 'UsersService', 'DebugConsoleService', 'getStorageLangService'];

  function HeaderController($scope, $state, $timeout, $translate, Authentication, menuService, MeanTorrentConfig, localStorageService, ScoreLevelService,
                            InvitationsService, $interval, MessagesService, TorrentsService, UsersService, mtDebug, getStorageLangService) {
    $scope.$state = $state;
    var vm = this;
    vm.user = Authentication.user;
    vm.langService = getStorageLangService;
    vm.language = MeanTorrentConfig.meanTorrentConfig.language;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.messageConfig = MeanTorrentConfig.meanTorrentConfig.messages;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.supportConfig = MeanTorrentConfig.meanTorrentConfig.support;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.messagesMenu = menuService.getMenu('mt-message').items[0];
    vm.statusMenu = menuService.getMenu('mt-user').items[0];
    vm.scoreMenu = menuService.getMenu('mt-user').items[1];
    vm.followMenu = menuService.getMenu('mt-user').items[2];
    vm.inviteMenu = menuService.getMenu('mt-invite').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.scoreLevelData = vm.user ? ScoreLevelService.getScoreLevelJson(vm.user.score) : undefined;

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    $(document).ready(function () {
      $('#warning_popup').popup({
        outline: false,
        focusdelay: 400,
        vertical: 'top',
        autoopen: false,
        opacity: 0.6,
        closetransitionend: function () {
          $('.popup_wrapper').remove();
        }
      });
    });

    /**
     * bindHoverToMenuItem
     */
    vm.bindHoverToMenuItem = function () {
      //set menu bar opened when hover
      $timeout(function () {
        $('div.navbar-mt ul.nav li.dropdown').off('mouseenter mouseleave').hover(function (evt) {
          if (!$(this).hasClass('open')) {
            $(this).find('.dropdown-toggle', this).trigger('click');
            $(this).off('click').on('click', function (e) {
              var sta = $(this).find('.dropdown-toggle', this).attr('alt');
              if (sta) {
                $state.go(sta);
              }
            });
          }
        }, function (evt) {
          $(this).off('click');
          if ($(this).hasClass('open')) {
            $(this).find('.dropdown-toggle', this).trigger('click');
          }
        });

        $('div.navbar-mt ul.nav li.dropdown ul.dropdown-menu').off('mouseenter mouseleave').hover(function (evt) {
          $(this).parent().off('click');
        }, function (evt) {
        });
      }, 0);
    };

    /**
     * auth-user-changed
     */
    $scope.$on('auth-user-changed', function (event, args) {
      vm.user = Authentication.user;
      vm.scoreLevelData = vm.user ? ScoreLevelService.getScoreLevelJson(vm.user.score) : undefined;
      vm.bindHoverToMenuItem();
      vm.getInvitationsCount();
      vm.getWarning();
      vm.getCountUnread();
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
     * user-follow-changed
     */
    $scope.$on('user-follow-changed', function (event, u) {
      vm.user = Authentication.user = u;
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
     * getFollowCount
     * @param item
     */
    vm.getFollowCount = function (item) {
      if (item.state.indexOf('followers') >= 0) {
        return vm.user ? vm.user.followers.length : 0;
      } else {
        return vm.user ? vm.user.following.length : 0;
      }
    };

    /**
     * getWarningInfo
     */
    vm.getWarningInfo = function () {
      var sw = localStorageService.get('showed_warning');
      if (vm.appConfig.showDemoWarningPopup && !sw) {
        $timeout(function () {
          $('#warning_popup').popup('show');
        }, 10);

        localStorageService.set('showed_warning', true);
      }
      if (sw) {
        $('.popup_wrapper').remove();
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
          vm.unreadCount = data.countAll;
        });
      }
    };

    /**
     * checkHnRWarning
     */
    vm.checkHnRWarning = function () {
      if(vm.hnrConfig.enable) {
        vm.getWarning();
        $interval(vm.getWarning, vm.hnrConfig.checkWaringInterval);
      }
    };

    vm.getWarning = function () {
      if (Authentication.user && vm.hnrConfig.enable) {
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
