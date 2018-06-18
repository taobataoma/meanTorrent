(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'MENU_MORE',
      state: 'more',
      type: 'dropdown',
      roles: ['*'],
      class: 'sm-show',
      position: 15
    });

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
      state: 'settings.profile',
      faIcon: 'fa-id-card',
      faClass: 'text-mt'
    });

    // menuService.addSubMenuItem('account', 'settings', {
    //   title: 'EDIT_PROFILE_PIC',
    //   state: 'settings.picture',
    //   faIcon: 'fa-image',
    //   faClass: 'text-mt'
    // });
    //
    // menuService.addSubMenuItem('account', 'settings', {
    //   title: 'EDIT_SIGNATURE',
    //   state: 'settings.signature',
    //   faIcon: 'fa-sign',
    //   faClass: 'text-mt'
    // });
    //
    // menuService.addSubMenuItem('account', 'settings', {
    //   title: 'CHANGE_PASSWORD',
    //   state: 'settings.password',
    //   faIcon: 'fa-lock',
    //   faClass: 'text-mt'
    // });
    //
    // menuService.addSubMenuItem('account', 'settings', {
    //   title: 'RESET_PASSKEY',
    //   state: 'settings.passkey',
    //   faIcon: 'fa-key',
    //   faClass: 'text-mt'
    // });
  }
}());
