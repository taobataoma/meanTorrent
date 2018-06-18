(function () {
  'use strict';

  angular
    .module('forums')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'MENU_FORUMS',
      state: 'forums.list',
      roles: ['*'],
      class: 'sm-hide',
      position: 6
    });

    //add to more
    menuService.addSubMenuItem('topbar', 'more', {
      title: 'MENU_FORUMS',
      state: 'forums.list',
      roles: ['*'],
      faIcon: 'fa-bars',
      faClass: 'text-mt',
      position: 2
    });
  }
}());
