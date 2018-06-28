(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notification', 'MeanTorrentConfig'];

  function EditProfileController($scope, $http, $location, UsersService, Authentication, Notification, MeanTorrentConfig) {
    var vm = this;

    vm.user = Authentication.user;
    vm.signConfig = MeanTorrentConfig.meanTorrentConfig.sign;
    vm.updateUserProfile = updateUserProfile;

    // Update a user profile
    function updateUserProfile(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      vm.user.lastName = '';
      var user = new UsersService(vm.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Edit profile successful!'});
        Authentication.user = response;
      }, function (response) {
        Notification.error({message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!'});
      });
    }
  }
}());
