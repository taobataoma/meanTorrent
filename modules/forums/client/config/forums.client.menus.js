(function () {
  'use strict';

  angular
    .module('forums')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate'];

  function menuConfig(menuService, $translate) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: $translate.instant('MENU_FORUMS'),
      state: 'forums',
      roles: ['*'],
      position: 1
    });
  }
}());
