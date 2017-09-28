(function () {
  'use strict';

  angular
    .module('torrents.services')
    .factory('DownloadService', DownloadService);

  DownloadService.$inject = ['$http', 'FileSaver'];

  function DownloadService($http, FileSaver) {

    return {
      downloadFile: downloadFile
    };

    function downloadFile(url, request, successcb, errorcb) {
      $http({
        url: url,
        method: 'GET',
        params: request,
        responseType: 'blob'
      }).then(function successCallback(response) {
        var contentDisposition = response.headers('Content-Disposition');
        var fileName = decodeURI(contentDisposition.substr(contentDisposition.indexOf('filename=') + 9));
        FileSaver.saveAs(response.data, fileName);

        if (successcb) successcb(response.status);
      }, function errorCallback(response) {
        if (errorcb) errorcb(response);
      });
    }
  }
}());
