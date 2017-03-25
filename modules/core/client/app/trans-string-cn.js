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
    COMINGSOON: '开发中，请稍候...'
  };

  // **************************************************
  // 中文翻译结束
  // **************************************************

  // config $translateProvider
  transConfig.$inject = ['$translateProvider'];
  function transConfig($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.translations('cn', stringcn);
  }

}(ApplicationConfiguration));
