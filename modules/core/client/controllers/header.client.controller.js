(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'Authentication', 'menuService', 'MeanTorrentConfig', 'localStorageService',
    'ScoreLevelService', 'InvitationsService', '$interval', 'MessagesService', 'marked', 'UsersService', 'DebugConsoleService', 'getStorageLangService',
    'AdminMessagesService', 'TorrentsService', 'MailTicketsService'];

  function HeaderController($scope, $rootScope, $state, $timeout, $translate, Authentication, menuService, MeanTorrentConfig, localStorageService,
                            ScoreLevelService, InvitationsService, $interval, MessagesService, marked, UsersService, mtDebug, getStorageLangService,
                            AdminMessagesService, TorrentsService, MailTicketsService) {
    $scope.$state = $state;
    var vm = this;
    vm.user = Authentication.user;
    vm.langService = getStorageLangService;
    vm.language = MeanTorrentConfig.meanTorrentConfig.language;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.messageConfig = MeanTorrentConfig.meanTorrentConfig.messages;
    vm.hnrConfig = MeanTorrentConfig.meanTorrentConfig.hitAndRun;
    vm.supportConfig = MeanTorrentConfig.meanTorrentConfig.support;
    vm.torrentStatusConfig = MeanTorrentConfig.meanTorrentConfig.torrentStatus;
    vm.supportConfig = MeanTorrentConfig.meanTorrentConfig.support;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.messagesMenu = menuService.getMenu('mt-message').items[0];
    vm.statusMenu = menuService.getMenu('mt-user').items[0];
    vm.scoreMenu = menuService.getMenu('mt-user').items[1];
    vm.followMenu = menuService.getMenu('mt-user').items[2];
    vm.inviteMenu = menuService.getMenu('mt-invite').items[0];
    vm.dataCenterMenu = menuService.getMenu('mt-data-log');
    vm.favoritesMenu = menuService.getMenu('mt-favorite');
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.scoreLevelData = vm.user ? ScoreLevelService.getScoreLevelJson(vm.user.score) : undefined;

    vm.newTorrentCount = 0;
    vm.ticketsCount = 0;

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    /**
     * document.ready()
     */
    angular.element(document).ready(function () {
      $('#must_read_popup').popup({
        outline: false,
        focusdelay: 400,
        vertical: 'top',
        autoopen: false,
        opacity: 0.6,
        blur: false,
        escape: false,
        closetransitionend: function () {
          if ($scope.mustReadMessage.markReadMessage) {
            var mrMsg = new AdminMessagesService({
              _adminMessageId: $scope.mustReadMessage._id
            });
            mrMsg.$update(function (res) {
              $timeout(function () {
                vm.getCountUnread();
              }, 10);
            });
          }
        }
      });
    });

    /**
     * window.resize()
     */
    $(window).resize(function () {
      if (window.outerWidth <= 767) {
        $('div.navbar-mt ul.nav li.dropdown').off('mouseenter mouseleave');
        $('div.navbar-mt ul.nav li.dropdown').off('click');
        $('div.navbar-mt ul.nav li.dropdown ul.dropdown-menu').off('mouseenter mouseleave');
      } else {
        vm.bindHoverToMenuItem();
      }
    });

    /**
     * bindHoverToMenuItem
     */
    vm.bindHoverToMenuItem = function () {
      //set menu bar opened when hover
      if (window.outerWidth > 767) {
        $timeout(function () {
          $('div.navbar-mt ul.nav li.dropdown').off('mouseenter mouseleave').hover(function (evt) {
            if (!$(this).hasClass('open')) {
              $(this).find('.dropdown-toggle', this).trigger('click');
              bindClick($(this));
            } else {
              bindClick($(this));
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
            bindClick($(this).parent());
          });
        }, 0);
      }

      function bindClick(ele) {
        ele.off('click').on('click', function (e) {
          var sta = ele.find('.dropdown-toggle', ele).attr('alt');
          if (sta) {
            $state.go(sta);
          }
        });
      }
    };

    /**
     * $scope.$watch($('#nav-top-menu').width())
     */
    // $scope.$watch(function () {
    //   return $('#nav-top-menu').width();
    // }, function (newVal, oldVal) {
    //   if (newVal) {
    //     if (window.outerWidth > 767 && window.outerWidth < 992) { //sm screen
    //       if (newVal > 540) {
    //         $('a[ui-sref="chat"]').css('display', 'none');
    //       }
    //     } else if (window.outerWidth > 991 && window.outerWidth < 1200) { //md screen
    //       if (newVal > 580) {
    //         $('a[ui-sref="chat"]').css('display', 'none');
    //       }
    //     } else {
    //       $('a[ui-sref="chat"]').css('display', 'block');
    //     }
    //   }
    // });

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
     * new-torrents-changed
     */
    $scope.$on('new-torrents-changed', function (event, args) {
      vm.getNewTorrentsCount();
    });

    /**
     * opened-tickets-changed
     */
    $scope.$on('opened-tickets-changed', function (event, args) {
      vm.getTicketsOpenedCount();
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

          if (data.mustRead.length > 0) {
            $rootScope.mustReadMessage = data.mustRead[0];
            $rootScope.mustReadMessage.markReadMessage = false;

            $timeout(function () {
              $('#must_read_popup').popup('show');
            }, 10);
          }
        });
      }
    };

    /**
     * checkNewTorrents
     */
    vm.checkNewTorrents = function () {
      vm.getNewTorrentsCount();
      $interval(vm.getNewTorrentsCount, vm.torrentStatusConfig.checkNewTorrentsInterval);
    };

    vm.getNewTorrentsCount = function () {
      if (Authentication.user && Authentication.user.isOper) {
        TorrentsService.countNewTorrents(function (data) {
          vm.newTorrentCount = data.newCount;

          var ele = $('.header-dot-class-admin');
          if (ele) {
            if (vm.newTorrentCount <= 0 && vm.ticketsCount <= 0) {
              ele.css('display', 'none');
            } else {
              ele.css('display', 'block');
              if (vm.newTorrentCount > 0) {
                ele.addClass('new-torrent');
              } else {
                ele.removeClass('new-torrent');
              }

              if (vm.ticketsCount > 0) {
                ele.addClass('opened-tickets');
              } else {
                ele.removeClass('opened-tickets');
              }
            }
          }

          var badgeEle = $('.badge-class-admin-torrents');
          if (badgeEle) {
            if (vm.newTorrentCount > 0) {
              badgeEle.css('display', 'block');
              badgeEle.addClass('badge_info');
              badgeEle.html(vm.newTorrentCount);
            } else {
              badgeEle.css('display', 'none');
            }
          }
        });
      }
    };

    /**
     * checkTicketsOpened
     */
    vm.checkTicketsOpened = function () {
      vm.getTicketsOpenedCount();
      $interval(vm.getTicketsOpenedCount, vm.supportConfig.checkOpenedTicketsInterval);
    };

    vm.getTicketsOpenedCount = function () {
      if (Authentication.user && Authentication.user.isOper) {
        MailTicketsService.getOpenedAllCount(function (data) {
          vm.ticketsCount = data.ticketsOpenedCount;

          var ele = $('.header-dot-class-admin');
          if (ele) {
            if (vm.newTorrentCount <= 0 && vm.ticketsCount <= 0) {
              ele.css('display', 'none');
            } else {
              ele.css('display', 'block');
              if (vm.newTorrentCount > 0) {
                ele.addClass('new-torrent');
              } else {
                ele.removeClass('new-torrent');
              }

              if (vm.ticketsCount > 0) {
                ele.addClass('opened-tickets');
              } else {
                ele.removeClass('opened-tickets');
              }
            }
          }

          var badgeEle = $('.badge-class-admin-tickets');
          if (badgeEle) {
            if (vm.ticketsCount > 0) {
              badgeEle.css('display', 'block');
              badgeEle.addClass('badge_danger');
              badgeEle.html(vm.ticketsCount);
            } else {
              badgeEle.css('display', 'none');
            }
          }
        });
      }
    };

    /**
     * getMustReadMessageContentMarked
     * @param m
     * @returns {*}
     */
    $rootScope.getMustReadMessageContentMarked = function (m) {
      if (m) {
        return marked(m.content, {sanitize: true});
      }
    };

    /**
     * checkHnRWarning
     */
    vm.checkHnRWarning = function () {
      if (vm.hnrConfig.enable) {
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
      }
    };
  }
}());
