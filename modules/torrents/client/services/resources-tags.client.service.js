(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('torrents.services')
    .factory('ResourcesTagsConfig', ResourcesTagsConfig);

  ResourcesTagsConfig.$inject = ['$window'];

  function ResourcesTagsConfig($window) {
    var config = {
      resourcesTags: $window.resourcesTags
    };

    return config;
  }
}());
