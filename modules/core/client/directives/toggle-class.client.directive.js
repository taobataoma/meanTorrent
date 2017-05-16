(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('core')
    .directive('toggleClass', toggleClass);

  function toggleClass() {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.bind('click', function () {
        if (element.hasClass(attrs.toggleClass)) {
          element.removeClass(attrs.toggleClass);
          element.addClass(attrs.baseClass);
        } else {
          element.removeClass(attrs.baseClass);
          element.addClass(attrs.toggleClass);
        }
      });
    }
  }

  angular.module('core')
    .directive('mouseEnterToggleClass', mouseEnterToggleClass);

  function mouseEnterToggleClass() {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.bind('mouseenter', function () {
        if (!element.hasClass(attrs.mouseEnterToggleClass)) {
          element.addClass(attrs.mouseEnterToggleClass);
          element.removeClass(attrs.baseClass);

          element.siblings().removeClass(attrs.mouseEnterToggleClass);
          element.siblings().addClass(attrs.baseClass);
        }
      });
    }
  }
}());
