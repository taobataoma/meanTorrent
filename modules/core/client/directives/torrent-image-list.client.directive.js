(function () {
  'use strict';

  angular.module('core')
    .directive('torrentImageList', torrentImageList);

  torrentImageList.$inject = ['$sce', '$parse', '$compile', '$timeout'];

  function torrentImageList($sce, $parse, $compile, $timeout) {
    var directive = {
      restrict: 'A',
      priority: 10,
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.torrentImageList, function (til) {
        hideImage();

        var targetNode = document.getElementById(attrs.torrentImageList);

        var config = {childList: true};

        var callback = function (mutationsList) {
          for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
              hideImage();
            }
          }
        };

        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

        //observer.disconnect();

        function hideImage() {
          var imgs = element[0].querySelectorAll('img:not(.emoji)');
          console.log(imgs);
          angular.forEach(imgs, function (i) {
            if (i.previousSibling && i.previousSibling.tagName.toUpperCase() === 'BR') {
              i.previousSibling.remove();
            }
            if (i.parentElement.childElementCount === 1) {
              angular.element(i.parentElement).remove();
            } else {
              angular.element(i).remove();
            }
          });
        }
      });
    }
  }
}());
