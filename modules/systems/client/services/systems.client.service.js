(function () {
  'use strict';

  angular
    .module('systems.services')
    .factory('SystemsService', SystemsService);

  SystemsService.$inject = ['$resource'];

  function SystemsService($resource) {
    return $resource('/api/systems/:systemId', {
      requestId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getSystemEnvConfigFiles: {
        method: 'GET',
        url: '/api/systems/systemEnvConfigFiles'
      },
      getSystemAssetsConfigFiles: {
        method: 'GET',
        url: '/api/systems/systemAssetsConfigFiles'
      },
      getSystemTransConfigFiles: {
        method: 'GET',
        url: '/api/systems/systemTransConfigFiles'
      },
      getSystemTemplateConfigFiles: {
        method: 'GET',
        url: '/api/systems/systemTemplateConfigFiles'
      },
      getSystemConfigContent: {
        method: 'GET',
        url: '/api/systems/systemConfigContent'
      },
      setSystemConfigContent: {
        method: 'PUT',
        url: '/api/systems/systemConfigContent'
      },
      shellCommand: {
        method: 'PUT',
        url: '/api/systems/shellCommand'
      },
      initExaminationData: {
        method: 'PUT',
        url: '/api/systems/initExaminationData'
      },
      getExaminationStatus: {
        method: 'GET',
        url: '/api/systems/getExaminationStatus'
      },
      listFinishedUsers: {
        method: 'GET',
        url: '/api/systems/listFinishedUsers'
      },
      listUnfinishedUsers: {
        method: 'GET',
        url: '/api/systems/listUnfinishedUsers'
      },
      banAllUnfinishedUser: {
        method: 'PUT',
        url: '/api/systems/banAllUnfinishedUser'
      }
    });
  }
}());
