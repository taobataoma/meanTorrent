(function () {
  'use strict';

  angular.module('core')
    .directive('torrentImageList', torrentImageList);

  torrentImageList.$inject = ['$sce', '$parse', '$compile', '$timeout'];

  function torrentImageList($sce, $parse, $compile, $timeout) {
    var directive = {
      restrict: 'A',
      replace: true,
      priority: 10,
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.torrentImageList, function (til) {
        if (til) {
          console.log(element[0]);
          var imgs = element[0].querySelectorAll('img:not(.emoji)');
          console.log(imgs);
          angular.forEach(imgs, function (i) {
            if (i.parentElement.childElementCount === 1) {
              angular.element(i.parentElement).css('display', 'none');
            } else {
              angular.element(i).css('display', 'none');
            }
          });
        }
      });
    }
  }
}());
