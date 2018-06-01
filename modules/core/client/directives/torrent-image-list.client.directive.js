(function () {
  'use strict';

  angular.module('core')
    .directive('torrentImageList', torrentImageList);

  torrentImageList.$inject = ['$sce', '$parse', '$compile', '$timeout'];

  function torrentImageList($sce, $parse, $compile, $timeout) {
    var directive = {
      restrict: 'A',
      priority: 10,
      scope: {
        imgs: '='
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      attrs.$observe('torrentImageList', function (til) {
        if (til) {
          if (!attrs.hasOwnProperty('imgs')) {
            return console.error('no imgs attr is set in directive torrentImageList');
          }

          scope.$watch('imgs', function (newVal) {
            if (newVal) {
              organizeImage(newVal);
            }
          });
        }

        /**
         * organizeImage
         */
        function organizeImage(imgs) {
          //reorganize
          if (imgs && imgs.length > 0) {
            var imgDiv = element.find('.torrent-img-list');
            if (imgDiv) {
              imgDiv.remove();
            }

            var imgEleList = [];
            var imgList = angular.element('<div class="torrent-img-list"></div>');

            if (attrs.hasOwnProperty('stripClass')) {
              imgList.addClass(attrs.stripClass);
            }

            angular.forEach(imgs, function (img, idx) {
              var item = angular.element('<img>');
              var nsrc = img.substr(0, img.lastIndexOf('/') + 1) + 'crop/' + img.substr(img.lastIndexOf('/') + 1);

              item.attr('on-error-src', img);
              item.attr('id', img);
              item.attr('src', nsrc);
              item.addClass('img-item');

              imgEleList.push(item);
            });

            angular.forEach(imgEleList, function (item, idx) {
              if (attrs.imgClickEvent) {
                item.bind('click', function (evt) {
                  scope.$parent.$eval(attrs.imgClickEvent, {event: {event: evt, imgs: imgEleList, index: idx}});
                });
              }
              imgList.append(item);
            });

            element.append(imgList);
            $compile(imgList.contents())(scope);
          }
        }
      });
    }
  }
}());
