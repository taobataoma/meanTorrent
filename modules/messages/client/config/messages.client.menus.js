(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenu('mt', {
      roles: ['user']
    });

    menuService.addMenuItem('mt', {
      title: '',
      state: 'messages',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addMenuItem('mt', {
      title: '',
      state: 'status',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addMenuItem('mt', {
      title: '',
      state: 'score',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('mt', 'messages', {
      title: 'MENU_MESSAGE_INBOX',
      state: 'messages.inbox'
    });

    menuService.addSubMenuItem('mt', 'status', {
      title: 'MENU_ACCOUNT_STATUS',
      state: 'status.account'
    });

    menuService.addSubMenuItem('mt', 'score', {
      title: 'MENU_SCORE_LEVEL',
      state: 'score.detail'
    });
  }
}());
