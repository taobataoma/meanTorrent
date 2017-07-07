(function () {
  'use strict';

  angular.module('core')
    .directive('mtMarkdownEditor', mtMarkdownEditor);

  mtMarkdownEditor.$inject = ['localStorageService'];

  function mtMarkdownEditor(localStorageService) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      $(element).markdown({
        autofocus: false,
        savable: false,
        iconlibrary: 'fa',
        resize: 'vertical',
        language: localStorageService.get('storage_user_lang'),
        fullscreen: {enable: false},
        onChange: function (e) {
          ngModel.$setViewValue($('#postContent')[0].value);
        }
      });
    }
  }
}());
