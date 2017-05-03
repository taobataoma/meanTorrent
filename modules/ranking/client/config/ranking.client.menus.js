(function () {
  'use strict';

  angular
    .module('ranking')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate'];

  function menuConfig(menuService, $translate) {
    menuService.addMenuItem('topbar', {
      title: $translate.instant('MENU_RANKING'),
      state: 'ranking',
      roles: ['*'],
      position: 4
    });
  }
}());
