(function () {
  'use strict';

  angular.module('core')
    .directive('tmdbImageList', tmdbImageList);

  tmdbImageList.$inject = ['$sce', '$parse', '$compile', '$timeout', 'MeanTorrentConfig'];

  function tmdbImageList($sce, $parse, $compile, $timeout, MeanTorrentConfig) {
    var tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;

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
      attrs.$observe('tmdbImageList', function (til) {
        if (til) {
          if (!attrs.hasOwnProperty('imgs')) {
            return console.error('no imgs attr is set in directive tmdbImageList');
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
            var imgList = angular.element('<div class="torrent-img-list film-strip"></div>');

            angular.forEach(imgs, function (img, idx) {
              var item = angular.element('<img>');
              var nsrc = tmdbConfig.backdropImgBaseUrl_780 + img.file_path;
              var esrc = tmdbConfig.backdropImgBaseUrl + img.file_path;
              var bsrc = tmdbConfig.backdropImgBaseUrl_1280 + img.file_path;

              if (window.outerWidth <= 767) {
                esrc = tmdbConfig.backdropImgBaseUrl_780 + img.file_path;
                bsrc = tmdbConfig.backdropImgBaseUrl_300 + img.file_path;
              } else if (window.outerWidth <= 1440) {
                esrc = tmdbConfig.backdropImgBaseUrl_1280 + img.file_path;
                bsrc = tmdbConfig.backdropImgBaseUrl_780 + img.file_path;
              }

              item.attr('on-error-src', esrc);
              item.attr('id', img.file_path.substr(1));
              item.attr('src', nsrc);
              item.attr('data-back-src', bsrc);
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
