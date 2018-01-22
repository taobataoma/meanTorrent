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
                angular.element(i.previousSibling).remove();
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
              var src = item.attr('src');
              var nsrc = src.substr(0, src.lastIndexOf('/') + 1) + 'crop/' + src.substr(src.lastIndexOf('/') + 1);

              item.attr('on-error-src', item.attr('src'));
              item.attr('src', nsrc);
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
            $compile(imgList.contents())(scope);

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
