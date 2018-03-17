(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenu('mt-message', {
      roles: ['user']
    });

    menuService.addMenuItem('mt-message', {
      title: '',
      state: 'messages',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('mt-message', 'messages', {
      title: 'MENU_MESSAGE_BOX',
      state: 'messages.box',
      faIcon: 'fa-comments',
      faClass: 'fa-class-user-message'
    });
  }
}());
