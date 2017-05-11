(function () {
  'use strict';

  angular.module('core')
    .directive('dynamicHtml', dynamicHtml);

  dynamicHtml.$inject = ['$compile'];

  function dynamicHtml($compile) {
    var directive = {
      restrict: 'A',
      replace: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.dynamicHtml, function (html) {
        element.html(html);
        $compile(element.contents())(scope);
      });
    }
  }
}());
