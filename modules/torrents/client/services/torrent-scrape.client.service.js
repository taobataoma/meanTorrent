(function () {
  'use strict';

  angular
    .module('torrents.services')
    .factory('ScrapeService', ScrapeService);

  ScrapeService.$inject = ['$http'];

  function ScrapeService($http) {

    return {
      scrapeTorrent: scrapeTorrent
    };

    function scrapeTorrent(url, info_hash, successcb, errorcb) {
      $http({
        url: url,
        method: 'GET',
        params: info_hash,
        responseType: 'blob'
      }).then(function successCallback(res) {
        console.log(res);

        successcb(res.status);
      }, function errorCallback(res) {
        errorcb(res);
      });
    }
  }
}());
