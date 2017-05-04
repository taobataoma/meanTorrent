(function () {
  'use strict';

  angular
    .module('ranking')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate'];

  function menuConfig(menuService, $translate) {
    menuService.addMenuItem('topbar', {
      title: $translate.instant('MENU_RULES'),
      state: 'rules',
      roles: ['*'],
      position: 5
    });
  }
}());
