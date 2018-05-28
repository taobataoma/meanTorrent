(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.services')
    .factory('UsersService', UsersService);

  UsersService.$inject = ['$resource', 'CacheFactory'];

  function UsersService($resource, CacheFactory) {
    var usersCache = CacheFactory.get('usersCache') || CacheFactory.createCache('usersCache');
    var removeCache = function (res) {
      usersCache.removeAll();
      return res.resource;
    };

    var Users = $resource('/api/users', {}, {
      get: {
        method: 'GET',
        cache: usersCache
      },
      query: {
        method: 'GET',
        cache: usersCache
      },
      update: {
        method: 'PUT',
        interceptor: {response: removeCache}
      },
      save: {
        method: 'POST',
        interceptor: {response: removeCache}
      },
      remove: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      delete: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      updatePassword: {
        method: 'POST',
        url: '/api/users/password',
        interceptor: {response: removeCache}
      },
      resetPasskey: {
        method: 'POST',
        url: '/api/users/passkey',
        interceptor: {response: removeCache}
      },
      updateSignature: {
        method: 'POST',
        url: '/api/users/signature',
        interceptor: {response: removeCache}
      },
      warningNumber: {
        method: 'GET',
        url: '/api/users/warningNumber'
      },
      deleteProvider: {
        method: 'DELETE',
        url: '/api/users/accounts',
        params: {
          provider: '@provider'
        },
        interceptor: {response: removeCache}
      },
      sendPasswordResetToken: {
        method: 'POST',
        url: '/api/auth/forgot',
        interceptor: {response: removeCache}
      },
      resetPasswordWithToken: {
        method: 'POST',
        url: '/api/auth/reset/:token',
        interceptor: {response: removeCache}
      },
      signup: {
        method: 'POST',
        url: '/api/auth/signup',
        interceptor: {response: removeCache}
      },
      signin: {
        method: 'POST',
        url: '/api/auth/signin',
        interceptor: {response: removeCache}
      },
      unIdle: {
        method: 'POST',
        url: '/api/users/unIdle',
        interceptor: {response: removeCache}
      },
      followTo: {
        method: 'POST',
        url: '/api/users/followTo/:userId',
        params: {
          userId: '@userId'
        },
        interceptor: {response: removeCache}
      },
      unFollowTo: {
        method: 'POST',
        url: '/api/users/unFollowTo/:userId',
        params: {
          userId: '@userId'
        },
        interceptor: {response: removeCache}
      },
      myFollowers: {
        method: 'GET',
        url: '/api/users/followers',
        isArray: true,
        cache: usersCache
      },
      myFollowing: {
        method: 'GET',
        url: '/api/users/following',
        isArray: true,
        cache: usersCache
      },
      userFollowers: {
        method: 'GET',
        url: '/api/users/:userId/followers',
        isArray: true,
        cache: usersCache
      },
      userFollowing: {
        method: 'GET',
        url: '/api/users/:userId/following',
        isArray: true,
        cache: usersCache
      },
      getMyIp: {
        method: 'GET',
        url: '/api/users/myIp'
      }
    });

    angular.extend(Users, {
      changePassword: function (passwordDetails) {
        return this.updatePassword(passwordDetails).$promise;
      },
      changePasskey: function () {
        return this.resetPasskey().$promise;
      },
      changeSignature: function (signText) {
        return this.updateSignature(signText).$promise;
      },
      getUserWarningNumber: function () {
        return this.warningNumber().$promise;
      },
      removeSocialAccount: function (provider) {
        return this.deleteProvider({
          provider: provider // api expects provider as a querystring parameter
        }).$promise;
      },
      requestPasswordReset: function (credentials) {
        return this.sendPasswordResetToken(credentials).$promise;
      },
      resetPassword: function (token, passwordDetails) {
        return this.resetPasswordWithToken({
          token: token // api expects token as a parameter (i.e. /:token)
        }, passwordDetails).$promise;
      },
      userSignup: function (credentials) {
        return this.signup(credentials).$promise;
      },
      userSignin: function (credentials) {
        return this.signin(credentials).$promise;
      },
      userUnIdle: function () {
        return this.unIdle().$promise;
      },
      userFollowTo: function (uid) {
        return this.followTo(uid).$promise;
      },
      userUnfollowTo: function (uid) {
        return this.unFollowTo(uid).$promise;
      },
      getMyFollowers: function (params) {
        return this.myFollowers(params).$promise;
      },
      getMyFollowing: function (params) {
        return this.myFollowing(params).$promise;
      },
      getUserFollowers: function (params) {
        return this.userFollowers(params).$promise;
      },
      getUserFollowing: function (params) {
        return this.userFollowing(params).$promise;
      }
    });

    return Users;
  }

  // this should be Users service
  angular
    .module('users.admin.services')
    .factory('AdminService', AdminService);

  AdminService.$inject = ['$resource', 'CacheFactory'];

  function AdminService($resource, CacheFactory) {
    var usersCache = CacheFactory.get('usersCache') || CacheFactory.createCache('usersCache');
    var removeCache = function (res) {
      usersCache.removeAll();
      return res.resource;
    };

    var Users = $resource('/api/users/:userId', {
      userId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: usersCache
      },
      query: {
        method: 'GET',
        cache: usersCache
      },
      update: {
        method: 'PUT',
        interceptor: {response: removeCache}
      },
      save: {
        method: 'POST',
        interceptor: {response: removeCache}
      },
      remove: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      delete: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      updateUserRole: {
        method: 'POST',
        url: '/api/users/:userId/role',
        params: {
          userId: '@userId',
          userRole: '@userRole'
        },
        interceptor: {response: removeCache}
      },
      updateUserStatus: {
        method: 'POST',
        url: '/api/users/:userId/status',
        params: {
          userId: '@userId',
          userStatus: '@userStatus'
        },
        interceptor: {response: removeCache}
      },
      updateUserScore: {
        method: 'POST',
        url: '/api/users/:userId/score',
        params: {
          userId: '@userId',
          userScore: '@userScore'
        },
        interceptor: {response: removeCache}
      },
      updateUserUploaded: {
        method: 'POST',
        url: '/api/users/:userId/uploaded',
        params: {
          userId: '@userId',
          userUploaded: '@userUploaded'
        },
        interceptor: {response: removeCache}
      },
      updateUserDownloaded: {
        method: 'POST',
        url: '/api/users/:userId/downloaded',
        params: {
          userId: '@userId',
          userDownloaded: '@userDownloaded'
        },
        interceptor: {response: removeCache}
      },
      getUserUploadedTotal: {
        method: 'GET',
        url: '/api/users/:userId/uptotal',
        params: {
          userId: '@userId'
        }
      },
      setDefaultProfileImage: {
        method: 'PUT',
        url: '/api/users/:userId/resetImage',
        params: {
          userId: '@userId'
        },
        interceptor: {response: removeCache}
      },
      updateUserVIPMonths: {
        method: 'PUT',
        url: '/api/users/:userId/VIPMonths/:months',
        params: {
          userId: '@userId',
          months: '@months'
        },
        interceptor: {response: removeCache}
      },
      resetUserVIPData: {
        method: 'PUT',
        url: '/api/users/:userId/VIPMonths/reset',
        params: {
          userId: '@userId'
        },
        interceptor: {response: removeCache}
      },
      uploaderList: {
        method: 'GET',
        url: '/api/users/uploaderList',
        cache: usersCache
      },
      presentInvitations: {
        method: 'PUT',
        url: '/api/users/:userId/presentInvitations',
        params: {
          userId: '@userId'
        }
      }
    });

    angular.extend(Users, {
      setUserRole: function (params) {
        return this.updateUserRole(params).$promise;
      },
      setUserStatus: function (params) {
        return this.updateUserStatus(params).$promise;
      },
      setUserScore: function (params) {
        return this.updateUserScore(params).$promise;
      },
      setUserUploaded: function (params) {
        return this.updateUserUploaded(params).$promise;
      },
      setUserDownloaded: function (params) {
        return this.updateUserDownloaded(params).$promise;
      },
      countUserUploaded: function (params) {
        return this.getUserUploadedTotal(params).$promise;
      },
      resetUserProfileImage: function (params) {
        return this.setDefaultProfileImage(params).$promise;
      },
      addVIPMonths: function (params) {
        return this.updateUserVIPMonths(params).$promise;
      },
      resetVIPData: function (params) {
        return this.resetUserVIPData(params).$promise;
      },
      getUploaderList: function (params) {
        return this.uploaderList(params).$promise;
      },
      presentUserInvitations: function (params) {
        return this.presentInvitations(params).$promise;
      }

    });

    return Users;
  }
}());
