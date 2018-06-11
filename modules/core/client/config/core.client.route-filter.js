(function () {
  'use strict';

  angular
    .module('core')
    .run(routeFilter);

  routeFilter.$inject = ['$rootScope', '$state', 'Authentication', 'MeanTorrentConfig', 'UsersService', 'DebugConsoleService', '$urlRouter'];

  function routeFilter($rootScope, $state, Authentication, MeanTorrentConfig, UsersService, mtDebug, $urlRouter) {
    $rootScope.$on('$stateChangeStart', stateChangeStart);
    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeStart(event, toState, toParams, fromState, fromParams) {
      $('.side-background').remove();
      $('.textcomplete-dropdown').remove();
      $('#uploaded_popup_wrapper').remove();
      $('#uploaded_popup_background').remove();
      // Check authentication before changing state
      if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
        var allowed = false;

        for (var i = 0, roles = toState.data.roles; i < roles.length; i++) {
          if ((roles[i] === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(roles[i]) !== -1)) {
            allowed = true;
            break;
          }
        }

        if (!allowed) {
          event.preventDefault();
          if (toState.data.rolesStateTo) {
            $state.go(toState.data.rolesStateTo);
          } else if (Authentication.user !== null && typeof Authentication.user === 'object') {
            $state.transitionTo('forbidden');
          } else {
            $state.go('authentication.signin').then(function () {
              // Record previous state
              storePreviousState(toState, toParams);
            });
          }
        } else {
          if (toState.name.startsWith('admin.')) {
            var accessConfig = MeanTorrentConfig.meanTorrentConfig.access;

            if (accessConfig.admin.limit) {
              if ($rootScope.ipIdentify) {
                $rootScope.ipIdentify = false;
                return;
              }

              event.preventDefault();
              UsersService.getMyIp(function (res) {
                if (Authentication.user && !accessConfig.admin.limitedIp.includes(res.ip)) {
                  $state.transitionTo('access-deny');
                } else {
                  $rootScope.ipIdentify = true;
                  $state.go(toState, toParams);
                }
              });
            }
          }
        }
      }
    }

    function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
      // Record previous state
      storePreviousState(fromState, fromParams);

      if (toState.name === 'home') {
        $('.page-content').css('background-color', 'transparent');
      } else {
        $('.page-content').css('background-color', '#fff');
      }
    }

    // Store previous state
    function storePreviousState(state, params) {
      // only store this state if it shouldn't be ignored
      if (!state.data || !state.data.ignoreState) {
        $state.previous = {
          state: state,
          params: params,
          href: $state.href(state, params)
        };
      }
    }
  }
}());
