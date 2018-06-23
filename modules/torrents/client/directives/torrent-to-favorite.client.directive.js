(function () {
  'use strict';

  angular.module('users')
    .directive('torrentToFavoriteLabel', torrentToFavoriteLabel);

  torrentToFavoriteLabel.$inject = ['$compile', '$translate'];

  function torrentToFavoriteLabel($compile, $translate) {

    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.torrentToFavoriteLabel, function (s) {
        if (s) {
          var txt = $translate.instant('MENU_MY_FAVORITE');
          var title = $translate.instant('FAVORITES.TORRENT_TO_FAVORITE_TITLE');
          var cls = attrs.infoClass;
          var e = angular.element('<span class="label"><i class="fa fa-plus-square margin-right-3"></i>' + txt + '</span>');

          if (e) {
            e.addClass(cls ? cls : '');
            e.attr('title', title);

            element.html(e);
            $compile(element.contents())(scope);
          }
        }
      });
    }
  }
}());
