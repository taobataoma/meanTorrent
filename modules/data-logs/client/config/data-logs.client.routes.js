(function () {
  'use strict';

  // Setting up route
  angular
    .module('dataLogs.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('dataCenter', {
        abstract: true,
        url: '/dataCenter',
        templateUrl: '/modules/data-logs/client/views/data.client.view.html',
        controller: 'DataCenterController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('dataCenter.score', {
        url: '/score?:uid',
        templateUrl: '/modules/data-logs/client/views/data-score.client.view.html',
        controller: 'DataCenterController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'PAGETITLE.DATA_CENTER'
        }
      })
      .state('dataCenter.uploaded', {
        url: '/uploaded?:uid',
        templateUrl: '/modules/data-logs/client/views/data-uploaded.client.view.html',
        controller: 'DataCenterController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'PAGETITLE.DATA_CENTER'
        }
      })
      .state('dataCenter.downloaded', {
        url: '/downloaded?:uid',
        templateUrl: '/modules/data-logs/client/views/data-downloaded.client.view.html',
        controller: 'DataCenterController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'PAGETITLE.DATA_CENTER'
        }
      })
      .state('dataCenter.scoreHistory', {
        url: '/scoreHistory?:uid',
        templateUrl: '/modules/data-logs/client/views/data-score-history.client.view.html',
        controller: 'DataCenterController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'PAGETITLE.DATA_CENTER'
        }
      })
      .state('dataCenter.uploadedHistory', {
        url: '/uploadedHistory?:uid',
        templateUrl: '/modules/data-logs/client/views/data-uploaded-history.client.view.html',
        controller: 'DataCenterController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'PAGETITLE.DATA_CENTER'
        }
      })
      .state('dataCenter.downloadedHistory', {
        url: '/downloadedHistory?:uid',
        templateUrl: '/modules/data-logs/client/views/data-downloaded-history.client.view.html',
        controller: 'DataCenterController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: 'PAGETITLE.DATA_CENTER'
        }
      });

    getUser.$inject = ['$stateParams', 'Authentication', 'AdminService'];

    function getUser($stateParams, Authentication, AdminService) {
      return AdminService.get({
        userId: $stateParams.uid || Authentication.user._id
      }).$promise;
    }

  }
}());
