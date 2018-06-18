(function () {
  'use strict';

  angular
    .module('medals')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'MENU_MEDALS',
      state: 'medals.list',
      roles: ['*'],
      class: 'sm-hide',
      position: 5
    });

    //add to more
    menuService.addSubMenuItem('topbar', 'more', {
      title: 'MENU_MEDALS',
      state: 'medals.list',
      roles: ['*'],
      faIcon: 'fa-shield-alt',
      faClass: 'text-mt',
      position: 1
    });

  }
}());
