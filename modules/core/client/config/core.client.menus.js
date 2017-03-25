(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate', '$filter'];

  function menuConfig(menuService, $translate) {
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
      title: $translate.instant('EDIT_PROFILE'),
      state: 'settings.profile'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: $translate.instant('EDIT_PROFILE_PIC'),
      state: 'settings.picture'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: $translate.instant('CHANGE_PASSWORD'),
      state: 'settings.password'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: $translate.instant('MANAGE_SOCIAL_ACCOUNTS'),
      state: 'settings.accounts'
    });
  }
}());
