'use strict';

angular
  .module('core')
  .service('mtCopy', ['$window', function ($window) {
    var body = angular.element($window.document.body);
    var textarea = angular.element('<textarea/>');
    textarea.css({
      position: 'fixed',
      opacity: '0'
    });

    return function (toCopy) {
      textarea.val(toCopy);
      body.append(textarea);
      textarea[0].select();

      document.execCommand('copy');

      textarea.remove();
    };
  }])

  .directive('mtCopyToClipboard', ['mtCopy', function (mtCopy) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('click', function (e) {
          mtCopy(attrs.mtCopyToClipboard);
        });
      }
    };
  }]);
