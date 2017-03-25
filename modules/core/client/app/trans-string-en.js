(function (app) {
  'use strict';

  // Setting HTML5 Location Mode
  angular
    .module(app.applicationModuleName)
    .config(transConfig);

  // **************************************************
  // English Strings
  // --------------------------------------------------
  // Don`t change other code
  // **************************************************

  var stringen = {
    COMINGSOON: 'coming soon...',

    //client menu
    SIGNOUT: 'Signout',
    SIGNIN: 'Sign In',
    SIGNUP: 'Sign Up',
    EDIT_PROFILE: 'Edit Profile',
    EDIT_PROFILE_PIC: 'Edit Profile Picture',
    CHANGE_PASSWORD: 'Change Password',
    MANAGE_SOCIAL_ACCOUNTS: 'Manage Social Accounts'
  };

  // **************************************************
  // English Strings end
  // **************************************************

  // config $translateProvider
  transConfig.$inject = ['$translateProvider'];
  function transConfig($translateProvider) {
    $translateProvider.translations('en', stringen);
  }

}(ApplicationConfiguration));
