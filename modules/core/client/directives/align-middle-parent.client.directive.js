(function () {
  'use strict';

  angular.module('core')
    .directive('alignMiddleParent', alignMiddleParent);

  alignMiddleParent.$inject = ['$timeout'];

  function alignMiddleParent($timeout) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      element.on('load', function (event) {
        $timeout(function () {
          console.log('image load in directive');
          // element.parent().height(element.parent().width() / 1.772);

          if (element.height() > element.parent().height()) {
            element.css('margin-top', -(element.height() - element.parent().height()) / 2);
          } else {
            element.css('margin-top', (element.parent().height() - element.height()) / 2);
          }
        }, 0);
      });
    }
  }
}());
