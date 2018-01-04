(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenu('mt-user', {
      roles: ['user']
    });

    menuService.addMenuItem('mt-user', {
      title: '',
      state: 'status',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addMenuItem('mt-user', {
      title: '',
      state: 'score',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addMenuItem('mt-user', {
      title: '',
      state: 'follow',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('mt-user', 'status', {
      title: 'MENU_ACCOUNT_STATUS',
      state: 'status.account'
    });

    menuService.addSubMenuItem('mt-user', 'score', {
      title: 'MENU_SCORE_LEVEL',
      state: 'score.detail'
    });

    menuService.addSubMenuItem('mt-user', 'follow', {
      title: 'MENU_FOLLOWERS',
      state: 'follow.followers'
    });

    menuService.addSubMenuItem('mt-user', 'follow', {
      title: 'MENU_FOLLOWING',
      state: 'follow.following'
    });
  }
}());
