(function () {
  'use strict';

  angular
    .module('invitations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenu('mt-invite', {
      roles: ['user']
    });

    menuService.addMenuItem('mt-invite', {
      title: '',
      state: 'invite',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('mt-invite', 'invite', {
      title: 'MENU_MY_INVITE',
      state: 'invitations.detail',
      faIcon: 'fa-user-plus',
      faClass: 'text-mt'
    });
  }
}());
