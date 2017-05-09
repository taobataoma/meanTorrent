(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenu('account', {
      roles: ['user']
    });

    menuService.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'EDIT_PROFILE',
      state: 'settings.profile'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'EDIT_PROFILE_PIC',
      state: 'settings.picture'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'CHANGE_PASSWORD',
      state: 'settings.password'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'RESET_PASSKEY',
      state: 'settings.passkey'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'MANAGE_SOCIAL_ACCOUNTS',
      state: 'settings.accounts'
    });
  }
}());
