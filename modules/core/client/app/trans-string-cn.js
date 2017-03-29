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

    //client topbar menu
    MENU_CHAT: '聊天室',
    MENU_TORRENTS: '种子',
    MENU_UPLOADS: '发布',
    MENU_FORUMS: '论坛',
    MENU_RANKING: '排行榜',
    MENU_RULES: '规则',
    MENU_VIP: 'VIP',
    MENU_ADMIN: '管理中心',

    //sub menu of torrents
    MENU_TORRENTS_SUB: {
      SUB_MOVIE: '电影',
      SUB_MTV: 'MTV',
      SUB_MUSIC: '音乐',
      SUB_OTHER: '其它'
    },

    //client account menu
    SIGNOUT: '退出登录',
    SIGNIN: '登录',
    SIGNUP: '注册',
    EDIT_PROFILE: '修改个人信息',
    EDIT_PROFILE_PIC: '修改个人头像',
    CHANGE_PASSWORD: '修改登录密码',
    MANAGE_SOCIAL_ACCOUNTS: '管理社交帐号',

    //发种规则
    UPLOADS_RULES: '上传规则：',
    UPLOADS_RULES_COUNT: '6',
    UPLOADS_RULES_CONTENT: [
      '种子文件的Tracker地址必须为：<mark><strong>{{url}}</strong></mark>.',
      '种子文件的 TMDB_ID 必须是 The Movie DB 相对应的资源ID号，<strong><a href="https://www.themoviedb.org/">您可以从这里找到ID号</a></strong>.',
      '资源的详细信息，系统会自动载入，如无误可直接提交.',
      '请为资源选择匹配的一个或多个标签，它会在您的搜索结果中发挥重大作用.',
      '种子文件提交后，可能会由后台管理人员进行审批，不符合规则的种子会被直接删除.',
      '如需其它帮助，请与我们的管理员联系：<strong><a href="mailto:#">{{admin}}</a></strong>.'
    ],

    //TorrentsUploadsController
    TORRENTS_UPLOAD_SUCCESSFULLY: '文件上传成功',
    TORRENTS_UPLOAD_FAILED: '文件上传失败',
    TORRENTS_NO_FILE_SELECTED: '请选择种子文件后再做尝试',

    SELECT_TORRENT_FILE: '请选择种子文件',
    SELECT_FILE: '选择文件',
    DO_UPLOADS: '上传'
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
