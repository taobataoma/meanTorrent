(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsUploadsController', TorrentsUploadsController);

  TorrentsUploadsController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'AnnounceConfig', 'Upload', 'Notification'];

  function TorrentsUploadsController($scope, $state, $translate, $timeout, Authentication, AnnounceConfig, Upload, Notification) {
    var vm = this;
    vm.announce = AnnounceConfig.announce;
    vm.rule_items = [];
    vm.user = Authentication.user;
    vm.progress = 0;
    vm.successfully = undefined;

    for (var i = 0; i < $translate.instant('UPLOADS_RULES_COUNT'); i++) {
      vm.rule_items[i] = i;
    }

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    //begin upload
    vm.upload = function (dataUrl) {
      console.log(dataUrl);

      if(dataUrl===null){
        vm.fileSelected = false;
        // Show success message
        Notification.success({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENTS_NO_FILE_SELECTED')
        });
        return;
      }

      Upload.upload({
        url: '/api/torrents/upload',
        data: {
          newTorrentFile: dataUrl
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response);
        });
      }, function (response) {
        console.log(response);
        if (response.status > 0) onErrorItem(response);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      vm.fileSelected = false;
      vm.successfully = true;
      // Show success message
      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENTS_UPLOAD_SUCCESSFULLY')
      });
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.successfully = false;
      vm.tFile = undefined;
      // Show error message
      Notification.error({
        message: response.data,
        title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENTS_UPLOAD_FAILED')
      });
    }
  }
}());
