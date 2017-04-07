(function () {
  'use strict';

  angular
    .module('torrents.services')
    .factory('DownloadService', DownloadService);

  DownloadService.$inject = ['$http', 'FileSaver'];

  function DownloadService($http, FileSaver) {

    return {
      downloadTorrentFile: downloadTorrentFile
    };

    function downloadTorrentFile(url, request, successcb, errorcb) {
      $http({
        url: url,
        method: 'GET',
        params: request,
        responseType: 'blob'
      }).then(function successCallback(response) {
        var contentDisposition = response.headers('Content-Disposition');
        var fileName = contentDisposition.substr(contentDisposition.indexOf('filename=') + 9);
        FileSaver.saveAs(response.data, fileName);

        successcb(response.status);
      }, function errorCallback(response) {
        errorcb(response);
      });
    }
  }
}());
