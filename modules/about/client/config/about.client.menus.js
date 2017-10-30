(function () {
  'use strict';

  angular
    .module('about')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'MENU_ABOUT',
      state: 'about',
      type: 'dropdown',
      roles: ['*'],
      class: 'sm-hide',
      position: 6
    });

    menuService.addSubMenuItem('topbar', 'about', {
      title: 'MENU_ABOUT_RULES',
      state: 'about.rules',
      position: 1
    });
    // 2 is item of Users Ranking configure in module ranking
    menuService.addSubMenuItem('topbar', 'about', {
      title: 'MENU_ABOUT_MAKERGROUP',
      state: 'about.maker',
      position: 3
    });
    menuService.addSubMenuItem('topbar', 'about', {
      title: 'MENU_ABOUT_OPERLIST',
      state: 'about.operlist',
      position: 4
    });
    menuService.addSubMenuItem('topbar', 'about', {
      title: 'MENU_ABOUT_BLACKLIST',
      state: 'about.black',
      position: 5,
      divider: true
    });

  }
}());
