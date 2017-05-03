(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangeProfilePictureController', ChangeProfilePictureController);

  ChangeProfilePictureController.$inject = ['$scope', '$timeout', 'Authentication', 'Upload', 'Notification'];

  function ChangeProfilePictureController($scope, $timeout, Authentication, Upload, Notification) {
    var vm = this;

    vm.user = Authentication.user;
    vm.progress = 0;

    vm.selectedImageUrl = '';
    vm.resultImageURL = '';


    Upload.onBeforeUploadItem = function (item) {
      var blob = vm.dataURItoBlob(vm.resultImageURL);
      item._file = blob;
    };

    vm.dataURItoBlob = function (dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: mimeString});
    };

    vm.upload = function () {
      Upload.upload({
        url: '/api/users/picture',
        data: {
          newProfilePicture: vm.dataURItoBlob(vm.resultImageURL)
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });


      // Called after the user has successfully uploaded a new picture
      function onSuccessItem(response) {
        // Show success message
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Successfully changed profile picture'});

        // Populate user object
        vm.user = Authentication.user = response;

        // Reset form
        vm.fileSelected = false;
        vm.progress = 0;
        vm.selectedImageUrl = '';
        vm.resultImageURL = '';
      }

      // Called after the user has failed to upload a new picture
      function onErrorItem(response) {
        vm.fileSelected = false;
        vm.progress = 0;
        vm.selectedImageUrl = '';
        vm.resultImageURL = '';

        // Show error message
        Notification.error({message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to change profile picture'});
      }
    };

    vm.handleFileSelect = function (evt) {
      vm.loading = false;

      if(evt.currentTarget.files) {
        var file = evt.currentTarget.files[0];

        var reader = new FileReader();
        reader.onload = function (evt) {
          $scope.$apply(function () {
            vm.fileSelected = true;
            vm.selectedImageUrl = evt.target.result;
          });
        };
        reader.readAsDataURL(file);
      }
    };

    vm.cancel = function () {
      vm.fileSelected = false;
      vm.progress = 0;
      vm.selectedImageUrl = '';
      vm.resultImageURL = '';
    };
  }
}());
