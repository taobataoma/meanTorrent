(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: '/modules/users/client/views/settings/settings.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: '/modules/users/client/views/settings/edit-profile.client.view.html',
        controller: 'EditProfileController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'EDIT_PROFILE'
        }
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: '/modules/users/client/views/settings/change-password.client.view.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'CHANGE_PASSWORD'
        }
      })
      .state('settings.passkey', {
        url: '/passkey',
        templateUrl: '/modules/users/client/views/settings/reset-passkey.client.view.html',
        controller: 'ResetPasskeyController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'RESET_PASSKEY'
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: '/modules/users/client/views/settings/manage-social-accounts.client.view.html',
        controller: 'SocialAccountsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'MANAGE_SOCIAL_ACCOUNTS'
        }
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: '/modules/users/client/views/settings/change-profile-picture.client.view.html',
        controller: 'ChangeProfilePictureController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'EDIT_PROFILE_PIC'
        }
      })
      .state('status', {
        abstract: true,
        url: '/status',
        templateUrl: '/modules/users/client/views/status/status.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('status.account', {
        url: '/account',
        templateUrl: '/modules/users/client/views/status/account.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.STATUS_ACCOUNT'
        }
      })
      .state('status.uploaded', {
        url: '/uploaded',
        templateUrl: '/modules/users/client/views/status/uploaded.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.STATUS_UPLOADED'
        }
      })
      .state('status.seeding', {
        url: '/seeding',
        templateUrl: '/modules/users/client/views/status/seeding.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.STATUS_SEEDING'
        }
      })
      .state('status.downloading', {
        url: '/downloading',
        templateUrl: '/modules/users/client/views/status/downloading.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.STATUS_DOWNLOADING'
        }
      })
      .state('status.warning', {
        url: '/warning',
        templateUrl: '/modules/users/client/views/status/warning.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.STATUS_WARNING'
        }
      })
      .state('score', {
        abstract: true,
        url: '/score',
        templateUrl: '/modules/users/client/views/score/score.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('score.detail', {
        url: '/detail',
        templateUrl: '/modules/users/client/views/score/detail.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.SCORE_DETAIL'
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm'
      })
      .state('authentication.signup', {
        url: '/signup?token',
        templateUrl: '/modules/users/client/views/authentication/signup.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'SIGNUP'
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: '/modules/users/client/views/authentication/signin.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'SIGNIN'
        }
      })
      .state('authentication.active', {
        url: '/active?method',
        templateUrl: '/modules/users/client/views/authentication/active.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'PAGETITLE.ACCOUNT_ACTIVE'
        }
      })
      .state('authentication.invite', {
        abstract: true,
        url: '/invite',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('authentication.invite.invalid', {
        url: '/invalid',
        templateUrl: '/modules/users/client/views/authentication/invite-invalid.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.INVITE_INVALID'
        }
      })
      .state('password', {
        abstract: true,
        url: '/password',
        templateUrl: '/modules/users/client/views/password/password.client.view.html'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: '/modules/users/client/views/password/forgot-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'PAGETITLE.PASSWORD_FORGOT'
        }
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: '/modules/users/client/views/password/reset-password-invalid.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.PASSWORD_RESET'
        }
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: '/modules/users/client/views/password/reset-password-success.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.PASSWORD_RESET'
        }
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: '/modules/users/client/views/password/reset-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'PAGETITLE.PASSWORD_RESET'
        }
      });
  }
}());
