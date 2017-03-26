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

    //client topbar menu
    MENU_CHAT: 'Chat',
    MENU_TORRENTS: 'Torrents',
    MENU_UPLOAD: 'Upload',
    MENU_FORUMS: 'Forums',
    MENU_RANKING: 'Ranking',
    MENU_RULES: 'Rules',
    MENU_VIP: 'VIP',
    MENU_ADMIN: 'Admin',

    //sub menu of torrents
    MENU_TORRENTS_SUB: {
      SUB_MOVIE: 'Movie',
      SUB_MTV: 'MTV',
      SUB_MUSIC: 'Music',
      SUB_OTHER: 'Other'
    },

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
