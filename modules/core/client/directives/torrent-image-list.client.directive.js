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
        var targetNode = element[0];
        var config = {childList: true};
        var callback = function (mutationsList) {
          for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
              organizeImage();
            }
          }
        };

        if (til) {
          organizeImage();
          var observer = new MutationObserver(callback);
          observer.observe(targetNode, config);

          //observer.disconnect();
        }

        /**
         * organizeImage
         */
        function organizeImage() {
          var imgs = targetNode.querySelectorAll('img:not(.emoji)');
          console.log(imgs);

          //remove
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
          //reorganize
          if (imgs.length > 0) {
            var imgDiv = targetNode.parentNode.querySelectorAll('.torrent-img-list');
            if (imgDiv) {
              angular.element(imgDiv).remove();
            }

            // var imgCap = angular.element('<div class="list-caption">{{}}</div>');
            var imgList = angular.element('<div class="torrent-img-list film-strip"></div>');

            angular.forEach(imgs, function (i) {
              var item = angular.element(i);
              item.addClass('img-item');
              imgList.append(item);
            });

            element.after(imgList);

            //change overview height
            var overviewDiv = targetNode.parentNode.querySelectorAll('.torrent-overview');
            if (overviewDiv) {
              angular.element(overviewDiv).css('max-height', '200px');
            }

          }
        }
      });
    }
  }
}());
