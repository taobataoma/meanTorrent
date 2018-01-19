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
      attrs.$observe('torrentImageList', function (til) {
        var targetNode = element[0];
        var config = {childList: true};
        var callback = function (mutationsList) {
          angular.forEach(mutationsList, function (mutation) {
            if (mutation.type === 'childList') {
              organizeImage();
            }
          });
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

          //remove
          angular.forEach(imgs, function (i) {
            if (i.parentElement.childElementCount === 1) {
              angular.element(i.parentElement).remove();
            } else {
              if (i.previousSibling && i.previousSibling.tagName.toUpperCase() === 'BR') {
                i.previousSibling.remove();
              }
              angular.element(i).remove();
            }
          });
          //reorganize
          if (imgs.length > 0) {
            var container = targetNode.parentNode;
            if (attrs.hasOwnProperty('imgContainer')) {
              container = document.getElementById(attrs.imgContainer);
            }

            var imgDiv = container.querySelectorAll('.torrent-img-list');
            if (imgDiv) {
              angular.element(imgDiv).remove();
            }

            var imgList = angular.element('<div class="torrent-img-list film-strip"></div>');

            angular.forEach(imgs, function (i, idx) {
              var item = angular.element(i);
              item.addClass('img-item');
              item.on('click', function (evt) {
                if (attrs.imgClickEvent) {
                  scope.$eval(attrs.imgClickEvent, {event: {event: evt, imgs: imgs, index: idx}});
                }
              });
              imgList.append(item);
            });

            angular.element(container).append(imgList);
            angular.element(container).css('display', 'block');

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
