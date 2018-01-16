(function () {
  'use strict';

  angular.module('core')
    .directive('upToTop', upToTop);

  upToTop.$inject = ['$timeout', '$window'];

  function upToTop($timeout, $window) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.upToTop, function (s) {
        if (attrs.upToTop) {
          element.css('cursor', 'pointer');
          element.css('display', 'none');
          element.css('position', 'fixed');
          element.css('right', '20px');
          element.css('bottom', '20px');
          element.css('width', '36px');
          element.css('height', '36px');
          element.css('border-radius', '50%');
          element.css('backgroundColor', 'rgba(255, 255, 255, 0.8)');

          var scTop = 0;

          angular.element($window).bind('scroll', function (e) {
            var eleTop = angular.element('#' + attrs.upToTop).prop('offsetTop');
            var shTop = eleTop + (attrs.hasOwnProperty('offset') ? parseInt(attrs.offset, 10) : 0);

            if ($(window).scrollTop() > eleTop) {
              element.css('display', 'block');
            } else {
              element.css('display', 'none');
            }

            if (shTop !== scTop) {
              scTop = shTop;

              element.bind('click', function (e) {
                $timeout(function () {
                  $('html,body').animate({scrollTop: scTop}, 300);
                }, 10);
              });
            }
          });

          var iEle = angular.element('<i></i>');

          iEle.css('position', 'relative');
          iEle.css('top', '-3px');

          iEle.addClass('fa');
          iEle.addClass('fa-arrow-circle-o-up');
          iEle.addClass('fa-3x');
          iEle.addClass('text-primary');

          iEle.bind('mouseover', function (e) {
            iEle.addClass('fa-arrow-circle-up');
            //iEle.addClass('text-primary');
          });
          iEle.bind('mouseleave', function (e) {
            iEle.removeClass('fa-arrow-circle-up');
            //iEle.removeClass('text-primary');
          });

          var wave = angular.element('<div></div>');
          wave.css('position', 'absolute');
          wave.css('top', '0');
          wave.css('left', '0');
          wave.css('width', '100%');
          wave.css('height', '100%');
          wave.css('border-radius', '50%');
          wave.css('z-index', '-1');
          wave.css('pointer-events', 'none');
          wave.css('backgroundColor', 'transparent');
          wave.css('border', 'solid 5px #888');
          wave.css('animation', 'sonarWave 2s linear infinite');

          wave.on('webkitAnimationIteration oanimationiteration animationiteration', function () {
            wave.css('borderColor', colorize());
          });

          element.append(iEle);
          element.append(wave);
        }
      });

      function colorize() {
        var hue = Math.random() * 360;
        return 'HSL(' + hue + ',100%,50%)';
      }
    }
  }
}());
