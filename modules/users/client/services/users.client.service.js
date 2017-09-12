(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.services')
    .factory('UsersService', UsersService);

  UsersService.$inject = ['$resource'];

  function UsersService($resource) {
    var Users = $resource('/api/users', {}, {
      update: {
        method: 'PUT'
      },
      updatePassword: {
        method: 'POST',
        url: '/api/users/password'
      },
      resetPasskey: {
        method: 'POST',
        url: '/api/users/passkey'
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
        }
      },
      sendPasswordResetToken: {
        method: 'POST',
        url: '/api/auth/forgot'
      },
      resetPasswordWithToken: {
        method: 'POST',
        url: '/api/auth/reset/:token'
      },
      signup: {
        method: 'POST',
        url: '/api/auth/signup'
      },
      signin: {
        method: 'POST',
        url: '/api/auth/signin'
      }
    });

    angular.extend(Users, {
      changePassword: function (passwordDetails) {
        return this.updatePassword(passwordDetails).$promise;
      },
      changePasskey: function () {
        return this.resetPasskey().$promise;
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
      }
    });

    return Users;
  }

  // this should be Users service
  angular
    .module('users.admin.services')
    .factory('AdminService', AdminService);

  AdminService.$inject = ['$resource'];

  function AdminService($resource) {
    var Users = $resource('/api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      updateUserRole: {
        method: 'POST',
        url: '/api/users/:userId/role',
        params: {
          userId: '@userId',
          userRole: '@userRole'
        }
      },
      updateUserStatus: {
        method: 'POST',
        url: '/api/users/:userId/status',
        params: {
          userId: '@userId',
          userStatus: '@userStatus'
        }
      },
      updateUserScore: {
        method: 'POST',
        url: '/api/users/:userId/score',
        params: {
          userId: '@userId',
          userScore: '@userScore'
        }
      },
      updateUserUploaded: {
        method: 'POST',
        url: '/api/users/:userId/uploaded',
        params: {
          userId: '@userId',
          userUploaded: '@userUploaded'
        }
      },
      updateUserDownloaded: {
        method: 'POST',
        url: '/api/users/:userId/downloaded',
        params: {
          userId: '@userId',
          userDownloaded: '@userDownloaded'
        }
      },
      getUserUploadedTotal: {
        method: 'GET',
        url: '/api/users/:userId/uptotal',
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
      }
    });

    return Users;
  }
}());
