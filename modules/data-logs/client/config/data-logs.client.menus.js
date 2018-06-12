(function () {
  'use strict';

  angular
    .module('dataLogs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenu('mt-data-log', {
      roles: ['user']
    });

    menuService.addMenuItem('mt-data-log', {
      title: 'MENU_MY_DATA_CENTER',
      state: 'dataCenter.score',
      faIcon: 'fa-chart-line',
      faClass: 'text-mt'
    });
  }
}());
