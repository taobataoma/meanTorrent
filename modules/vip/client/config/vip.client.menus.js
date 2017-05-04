(function () {
  'use strict';

  angular
    .module('vip')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate'];

  function menuConfig(menuService, $translate) {
    menuService.addMenuItem('topbar', {
      title: $translate.instant('MENU_VIP'),
      state: 'vip',
      roles: ['*'],
      position: 6
    });
  }
}());
