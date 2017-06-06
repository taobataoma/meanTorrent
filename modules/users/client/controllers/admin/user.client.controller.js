(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'NotifycationService', 'MeanTorrentConfig',
    'AdminService'];

  function UserController($scope, $state, $window, Authentication, user, Notification, NotifycationService, MeanTorrentConfig, AdminService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = user;
    vm.selectedRole = vm.user.roles[0];
    vm.userRolesConfig = MeanTorrentConfig.meanTorrentConfig.userRoles;
    vm.remove = remove;
    vm.update = update;
    vm.isContextUserSelf = isContextUserSelf;

    /**
     * remove
     * @param user
     */
    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!'});
          });
        }
      }
    }

    /**
     * update
     * @param isValid
     * @returns {boolean}
     */
    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!'});
      }, function (errorResponse) {
        Notification.error({message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!'});
      });
    }

    /**
     * isContextUserSelf
     * @returns {boolean}
     */
    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }

    /**
     * onUserRoleChanged
     * admin set user`s role
     */
    vm.onUserRoleChanged = function () {
      var user = vm.user;
      AdminService.setUserRole({
        userId: user._id,
        userRole: vm.selectedRole
      })
        .then(onSetRoleSuccess)
        .catch(onSetRoleError);

      function onSetRoleSuccess(response) {
        vm.user = response;

        NotifycationService.showSuccessNotify('SET_ROLE_SUCCESSFULLY');
      }

      function onSetRoleError(response) {
        NotifycationService.showErrorNotify(response.data.message, 'SET_ROLE_FAILED');
      }
    };
  }
}());
