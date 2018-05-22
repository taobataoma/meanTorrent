(function () {
  'use strict';

  angular
    .module('chat')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'MENU_CHAT',
      state: 'chat',
      roles: ['*'],
      target: '_blank',
      position: 6
    });
  }
}());
