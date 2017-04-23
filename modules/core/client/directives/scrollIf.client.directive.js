(function () {
  'use strict';

  angular.module('core')
    .directive('scrollIf', scrollIf);

  scrollIf.$inject = ['$uiViewScroll', '$location', '$anchorScroll'];

  function scrollIf($uiViewScroll) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.scrollIf, function (value) {
        if (value) {
          //element[0].scrollIntoView({block: 'end', behavior: 'smooth'});
          //$uiViewScroll(element);
          window.scrollTo(0, element[0].offsetTop - 60)
        }
      });
    }
  }
}());
