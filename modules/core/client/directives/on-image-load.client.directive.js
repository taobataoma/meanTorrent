(function () {
  'use strict';

  angular.module('core')
    .directive('onImageLoad', onImageLoad);

  onImageLoad.$inject = ['$parse'];

  function onImageLoad($parse) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      var fn = $parse(attrs.onImageLoad);
      element.on('load', function (event) {
        scope.$apply(function () {
          fn(scope, {$event: event});
        });
      });
    }
  }
}());
