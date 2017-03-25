(function (app) {
  'use strict';

  // Setting HTML5 Location Mode
  angular
    .module(app.applicationModuleName)
    .config(transConfig);

  // **************************************************
  // 中 文 翻 译
  // --------------------------------------------------
  // 请不要修改翻译部分之外的代码
  // **************************************************

  var stringcn = {
    COMINGSOON: '开发中，请稍候...',

    //client menu
    SIGNOUT: '退出登录',
    SIGNIN: '登录',
    SIGNUP: '注册',
    EDIT_PROFILE: '修改个人信息',
    EDIT_PROFILE_PIC: '修改个人头像',
    CHANGE_PASSWORD: '修改登录密码',
    MANAGE_SOCIAL_ACCOUNTS: '管理社交帐号'
  };

  // **************************************************
  // 中文翻译结束
  // **************************************************

  // config $translateProvider
  transConfig.$inject = ['$translateProvider'];
  function transConfig($translateProvider) {
    $translateProvider.translations('cn', stringcn);
  }

}(ApplicationConfiguration));
