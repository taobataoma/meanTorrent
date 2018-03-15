(function () {
  'use strict';

  angular
    .module('about.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('about', {
        abstract: true,
        url: '/about',
        template: '<ui-view/>'
      })
      .state('about.manual', {
        abstract: true,
        url: '/manual',
        templateUrl: '/modules/about/client/views/manual.client.view.html'
      })
      .state('about.manual.userRules', {
        url: '/usrRules',
        templateUrl: '/modules/about/client/views/userRules.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.USER_RULES'
        }
      })
      .state('about.manual.userLevelRules', {
        url: '/userLevelRules',
        templateUrl: '/modules/about/client/views/userLevelRules.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.USER_LEVEL_RULES'
        }
      })
      .state('about.manual.scoreRules', {
        url: '/scoreRules',
        templateUrl: '/modules/about/client/views/scoreRules.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.SCORE_RULES'
        }
      })
      .state('about.manual.uploaderRules', {
        url: '/uploaderRules',
        templateUrl: '/modules/about/client/views/uploaderRules.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.UPLOADER_RULES'
        }
      })
      .state('about.manual.invitationsRules', {
        url: '/invitationsRules',
        templateUrl: '/modules/about/client/views/invitationsRules.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.INVITATIONS_RULES'
        }
      })
      .state('about.manual.hnrRules', {
        url: '/hnrRules',
        templateUrl: '/modules/about/client/views/hnrRules.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.HNR_RULES'
        }
      })
      .state('about.manual.vipRules', {
        url: '/vipRules',
        templateUrl: '/modules/about/client/views/vipRules.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.VIP_DETAIL_RULES'
        }
      })
      .state('about.black', {
        url: '/black',
        templateUrl: '/modules/about/client/views/black.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.BLACK'
        }
      })
      .state('about.maker', {
        url: '/maker',
        templateUrl: '/modules/about/client/views/maker.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.MAKER'
        }
      })
      .state('about.group', {
        url: '/maker/:makerId',
        templateUrl: '/modules/about/client/views/maker-view.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.MAKER'
        }
      })
      .state('about.operlist', {
        url: '/operlist',
        templateUrl: '/modules/about/client/views/operlist.client.view.html',
        data: {
          roles: ['user', 'oper', 'admin'],
          pageTitle: 'PAGETITLE.OPERLIST'
        }
      });
  }
}());
