(function () {
  'use strict';

  angular.module('core')
    .directive('torrentLogo', torrentLogo);

  torrentLogo.$inject = ['$compile'];

  function torrentLogo($compile) {
    var directive = {
      restrict: 'A',
      replace: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.torrentLogo, function (s) {
        if (s) {
          switch (s.torrent_type) {
            case 'movie':
            case 'tvserial':
              break;
            case 'music':
              music_logo(scope, element, attrs, s);
              break;
            default:
              default_logo(scope, element, attrs, s);
          }
        }
      });
    }

    /**
     * music_logo
     *
     * @param scope
     * @param element
     * @param attrs
     * @param item
     */
    function music_logo(scope, element, attrs, item) {
      var border_color = '#515151';

      var div1 = angular.element('<div>MTV</div>');
      div1.addClass('music-badge');

      if (item.torrent_tags.indexOf('MTV') !== -1) {
        border_color = '#d9534f';
      }

      var cir1 = angular.element('<div></div>');
      cir1.css('border-radius', '50%');
      cir1.css('border', 'solid 2px ' + border_color);
      cir1.css('background-color', '#ddd');
      cir1.css('padding', '1px');
      cir1.css('cursor', 'pointer');
      cir1.attr('title', attrs.alt);

      var cir2 = angular.element('<div></div>');
      cir2.css('border-radius', '50%');
      if (attrs.src) {
        cir2.css('background-image', 'url("' + attrs.src + '")');
      }
      cir2.css('background-size', 'cover');
      cir2.css('background-position', 'center');
      cir2.css('background-repeat', 'no-repeat');
      cir2.css('height', '100%');
      cir2.css('width', '100%');
      cir2.css('padding', '36%');

      var cir3 = angular.element('<div></div>');
      cir3.css('border-radius', '50%');
      cir3.css('background-color', '#ddd');
      cir3.css('height', '100%');
      cir3.css('width', '100%');
      cir3.css('padding', '1px');

      var cir4 = angular.element('<div></div>');
      cir4.css('border-radius', '50%');
      cir4.css('border', 'solid 2px ' + border_color);
      cir4.css('background-color', '#fff');
      cir4.css('height', '100%');
      cir4.css('width', '100%');

      cir1.addClass('music');
      cir1.append(cir2);
      cir2.append(cir3);
      cir3.append(cir4);

      if (item.torrent_tags.indexOf('MTV') !== -1) {
        element.parent().append(div1);
      }
      element.replaceWith(cir1);
    }

    /**
     * default_logo
     *
     * @param scope
     * @param element
     * @param attrs
     * @param item
     */
    function default_logo(scope, element, attrs, item) {
      var div1 = angular.element('<div></div>');

      div1.css('cursor', 'pointer');
      div1.attr('title', attrs.alt);
      div1.css('border-radius', '0');
      if (attrs.src) {
        console.log(attrs.src);
        div1.css('background-image', 'url("' + attrs.src + '")');
      }
      div1.css('background-size', 'cover');
      div1.css('background-position', 'center');
      div1.css('background-repeat', 'no-repeat');
      div1.css('height', '100%');
      div1.css('width', '100%');
      div1.css('min-height', '100px');
      div1.css('min-width', '67px');
      div1.css('padding-top', '150%');

      div1.addClass('logo-div');

      element.replaceWith(div1);
    }
  }
}());
