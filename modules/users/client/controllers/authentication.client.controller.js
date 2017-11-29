(function () {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', '$timeout', 'Authentication', 'PasswordValidator', 'NotifycationService',
    'MeanTorrentConfig', 'getStorageLangService', '$rootScope', '$stateParams', 'InvitationsService', '$translate'];

  function AuthenticationController($scope, $state, UsersService, $location, $window, $timeout, Authentication, PasswordValidator, NotifycationService, MeanTorrentConfig,
                                    getStorageLangService, $rootScope, $stateParams, InvitationsService, $translate) {
    var vm = this;

    vm.lang = getStorageLangService.getLang();
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    vm.credentials = {};

    vm.activeMethod = $state.params.method;
    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      NotifycationService.showErrorNotify($location.search().err);
    }

    // If user is signed in then redirect back home
    if (vm.authentication.user && !vm.activeMethod) {
      $location.path('/');
    }

    /**
     * account active successfully, redirect to home after 2 seconds
     */
    if (vm.activeMethod === 'successfully') {
      $timeout(function () {
        $state.go('home');
      }, 3000);
    }

    /**
     * verifyToken
     */
    vm.verifyToken = function () {
      if ($stateParams.token) {
        InvitationsService.verifyToken({
          token: $stateParams.token
        }, function (res) {
          vm.validToken = res;
          vm.credentials.email = res.to_email;
          vm.emailReadonly = true;
        }, function (res) {
          vm.validToken = undefined;
        });
      }
    };

    /**
     * signup
     * @param isValid
     * @returns {boolean}
     */
    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      vm.isSendingMail = true;

      if ($stateParams.token) {
        vm.credentials.inviteToken = $stateParams.token;
      }

      vm.credentials.lastName = '';
      UsersService.userSignup(vm.credentials)
        .then(onUserSignupSuccess)
        .catch(onUserSignupError);

      function onUserSignupSuccess(response) {
        vm.waitToActive = true;
        vm.isSendingMail = false;
        vm.waitToActiveTranslate = response.message;
      }

      function onUserSignupError(response) {
        vm.isSendingMail = false;
        NotifycationService.showErrorNotify($translate.instant(response.data.message), 'SIGN.SIGNUP_ERROR');
      }

    }

    /**
     * signin
     * @param isValid
     * @returns {boolean}
     */
    function signin(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      UsersService.userSignin(vm.credentials)
        .then(onUserSigninSuccess)
        .catch(onUserSigninError);

      function onUserSigninSuccess(response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;
        $rootScope.$broadcast('auth-user-changed');
        $rootScope.$broadcast('user-invitations-changed');
        NotifycationService.showNotify('info', null, 'Welcome ' + response.displayName, false);
        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }

      function onUserSigninError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'SIGN.SIGNIN_ERROR');
      }
    }

    // OAuth provider request
    /**
     * callOauthProvider
     * @param url
     */
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }

    /**
     * markLinkClick
     * @param evt
     * @param citem
     */
    vm.markLinkClick = function (evt, citem) {
      if (evt.originalEvent.srcElement.attributes.href.nodeValue === '/vip') {
        evt.preventDefault();
        $state.go('vip');
      }
    };

  }
}());
