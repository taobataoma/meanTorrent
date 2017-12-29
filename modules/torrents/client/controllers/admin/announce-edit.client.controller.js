(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('AnnounceEditController', AnnounceEditController);

  AnnounceEditController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'Upload', 'Notification', 'MeanTorrentConfig', 'FileSaver',
    'DebugConsoleService'];

  function AnnounceEditController($scope, $state, $translate, $timeout, Authentication, Upload, Notification, MeanTorrentConfig, FileSaver,
                                  mtDebug) {
    var vm = this;
    vm.user = Authentication.user;
    vm.progress = 0;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.comment = vm.announceConfig.comment;

    /**
     * upload
     * @param dataUrl
     */
    vm.upload = function (dataUrl) {
      mtDebug.info(dataUrl);

      if (dataUrl === null || dataUrl === undefined) {
        vm.fileSelected = false;
        return;
      }

      Upload.upload({
        url: '/api/torrents/announceEdit',
        data: {
          newTorrentFile: dataUrl
        },
        params: {
          comment: vm.comment
        },
        responseType: 'blob'
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    /**
     * onSuccessItem
     * @param response
     */
    function onSuccessItem(res) {
      vm.fileSelected = false;
      vm.tFile = undefined;

      var contentDisposition = res.headers('Content-Disposition');
      var fileName = decodeURI(contentDisposition.substr(contentDisposition.indexOf('filename*=UTF-8\'\'') + 17));
      FileSaver.saveAs(res.data, fileName);
    }

    /**
     * onErrorItem
     * @param response
     */
    function onErrorItem(res) {
      mtDebug.info(res);
      vm.fileSelected = false;
      vm.tFile = undefined;
      // Show error message
      var reader = new FileReader();
      reader.addEventListener('loadend', function (r) {
        // reader.result contains the contents of blob as a typed array
        Notification.error({
          message: reader.result,
          title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENTS_UPLOAD_FAILED')
        });
      });
      reader.readAsText(res.data);
    }
  }
}());
