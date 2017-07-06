(function () {
  'use strict';

  angular
    .module('forums.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('forums', {
        abstract: true,
        url: '/forums',
        template: '<ui-view/>'
      })
      .state('forums.list', {
        url: '',
        templateUrl: '/modules/forums/client/views/index.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.FORUM'
        }
      })
      .state('forums.post', {
        url: '/:forumId/post',
        templateUrl: '/modules/forums/client/views/post.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.FORUM'
        }
      })
      .state('forums.view', {
        url: '/:forumId',
        templateUrl: '/modules/forums/client/views/view.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.FORUM'
        }
      });
  }
}());
