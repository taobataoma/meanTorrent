(function () {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', '$timeout', 'Authentication', 'PasswordValidator', 'NotifycationService',
    'MeanTorrentConfig', 'getStorageLangService', '$rootScope', '$stateParams', 'InvitationsService', '$translate', '$templateRequest', 'marked', '$filter'];

  function AuthenticationController($scope, $state, UsersService, $location, $window, $timeout, Authentication, PasswordValidator, NotifycationService, MeanTorrentConfig,
                                    getStorageLangService, $rootScope, $stateParams, InvitationsService, $translate, $templateRequest, marked, $filter) {
    var vm = this;

    vm.lang = getStorageLangService.getLang();
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
     * account active successfully, redirect to home after 3 seconds
     */
    if (vm.activeMethod === 'successfully') {
      $timeout(function () {
        $state.go('home');
      }, 3000);
    }

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

        user: vm.authentication.user
      });
      return marked(tmp, {sanitize: false});
    };

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
        if (vm.authentication.user.status === 'normal') {
          NotifycationService.showNotify('info', null, $translate.instant('SIGN.SIGNIN_WELCOME_NORMAL', {name: response.displayName}));
        }
        if (vm.authentication.user.status === 'idle') {
          NotifycationService.showNotify('error', null, $translate.instant('SIGN.SIGNIN_WELCOME_IDLE', {name: response.displayName}));
        }
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
