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
        data: {
          roles: ['user', 'oper', 'admin']
        }
      })
      .state('dataCenter.score', {
        url: '/score',
        templateUrl: '/modules/data-logs/client/views/data-score.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.DATA_CENTER'
        }
      })
      .state('dataCenter.uploaded', {
        url: '/uploaded',
        templateUrl: '/modules/data-logs/client/views/data-uploaded.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.DATA_CENTER'
        }
      })
      .state('dataCenter.downloaded', {
        url: '/downloaded',
        templateUrl: '/modules/data-logs/client/views/data-downloaded.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.DATA_CENTER'
        }
      })
      .state('dataCenter.scoreHistory', {
        url: '/scoreHistory',
        templateUrl: '/modules/data-logs/client/views/data-score-history.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.DATA_CENTER'
        }
      })
      .state('dataCenter.uploadedHistory', {
        url: '/uploadedHistory',
        templateUrl: '/modules/data-logs/client/views/data-uploaded-history.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.DATA_CENTER'
        }
      })
      .state('dataCenter.downloadedHistory', {
        url: '/downloadedHistory',
        templateUrl: '/modules/data-logs/client/views/data-downloaded-history.client.view.html',
        data: {
          pageTitle: 'PAGETITLE.DATA_CENTER'
        }
      });
  }
}());
