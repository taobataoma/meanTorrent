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
      class: 'sm-hide',
      target: '_blank',
      position: 7
    });

    //add to more
    menuService.addSubMenuItem('topbar', 'more', {
      title: 'MENU_CHAT',
      state: 'chat',
      roles: ['*'],
      faIcon: 'fa-comment-alt-dots',
      faClass: 'text-mt',
      target: '_blank',
      position: 2
    });
  }
}());
