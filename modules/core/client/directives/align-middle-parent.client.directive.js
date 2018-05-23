(function () {
  'use strict';

  angular.module('core')
    .directive('alignMiddleParent', alignMiddleParent);

  function alignMiddleParent($parse) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('load', function (event) {
        if (element.height() > element.parent().height()) {
          element.css('margin-top', -(element.height() - element.parent().height()) / 2);
        } else {
          element.css('margin-top', (element.parent().height() - element.height()) / 2);
        }
      });
    }
  }
}());
