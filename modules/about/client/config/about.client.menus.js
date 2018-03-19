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
      position: 7
    });

    menuService.addSubMenuItem('topbar', 'about', {
      title: 'MENU_ABOUT_MANUAL',
      state: 'about.manual.userRules',
      faIcon: 'fa-question-circle',
      faClass: 'text-mt',
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
      faIcon: 'fa-user-secret',
      faClass: 'text-mt',
      position: 4
    });
    menuService.addSubMenuItem('topbar', 'about', {
      title: 'MENU_ABOUT_BLACKLIST',
      state: 'about.black',
      faIcon: 'fa-ban',
      faClass: 'text-mt',
      position: 5,
      divider: true
    });

  }
}());
