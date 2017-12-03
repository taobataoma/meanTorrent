(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('torrents.services')
    .factory('ResourcesTagsServices', ResourcesTagsServices);

  ResourcesTagsServices.$inject = ['MeanTorrentConfig'];

  function ResourcesTagsServices(MeanTorrentConfig) {
    var resourcesTags = MeanTorrentConfig.meanTorrentConfig.resourcesTags;

    var service = {
      getTagTitle: getTagTitle,
      tagInList: tagInList
    };

    return service;

    /**
     * getTagTitle
     * @param tag
     * @returns {string}
     */
    function getTagTitle(tag) {
      var tmp = tag.toUpperCase();
      var find = false;

      angular.forEach(resourcesTags.radio, function (item) {
        angular.forEach(item.value, function (sitem) {
          if (sitem.name.toUpperCase() === tag.toUpperCase()) {
            tmp = item.name;
            find = true;
          }
        });
      });

      if (!find) {
        angular.forEach(resourcesTags.checkbox, function (item) {
          angular.forEach(item.value, function (sitem) {
            if (sitem.name.toUpperCase() === tag.toUpperCase()) {
              tmp = item.name;
            }
          });
        });
      }
      return tmp;
    }

    /**
     * tagInList
     * @param tag
     * @returns {string}
     */
    function tagInList(tag) {
      var find = false;

      angular.forEach(resourcesTags.radio, function (item) {
        angular.forEach(item.value, function (sitem) {
          if (sitem.name.toUpperCase() === tag.toUpperCase()) {
            find = true;
          }
        });
      });

      if (!find) {
        angular.forEach(resourcesTags.checkbox, function (item) {
          angular.forEach(item.value, function (sitem) {
            if (sitem.name.toUpperCase() === tag.toUpperCase()) {
              find = true;
            }
          });
        });
      }
      return find;
    }
  }
}());
