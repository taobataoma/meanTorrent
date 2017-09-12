(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: '/modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'PAGETITLE.ADMIN_USER_LIST'
        }
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: '/modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'PAGETITLE.ADMIN_USER_VIEW'
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: '/modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'PAGETITLE.ADMIN_USER_EDIT'
        }
      })
      .state('admin.user-seeding', {
        url: '/users/:userId/seeding',
        templateUrl: '/modules/users/client/views/admin/user-seeding.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'PAGETITLE.ADMIN_USER_SEEDING'
        }
      })
      .state('admin.user-leeching', {
        url: '/users/:userId/leeching',
        templateUrl: '/modules/users/client/views/admin/user-leeching.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'PAGETITLE.ADMIN_USER_LEECHING'
        }
      })
      .state('admin.user-warning', {
        url: '/users/:userId/warning',
        templateUrl: '/modules/users/client/views/admin/user-warning.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'PAGETITLE.ADMIN_USER_WARNING'
        }
      })
      .state('admin.user-uplist', {
        url: '/users/:userId/uplist',
        templateUrl: '/modules/users/client/views/admin/user-uplist.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'PAGETITLE.ADMIN_USER_UPLIST'
        }
      });

    getUser.$inject = ['$stateParams', 'AdminService'];

    function getUser($stateParams, AdminService) {
      return AdminService.get({
        userId: $stateParams.userId
      }).$promise;
    }
  }
}());
