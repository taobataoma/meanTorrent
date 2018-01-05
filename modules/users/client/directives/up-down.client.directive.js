(function () {
  'use strict';

  angular.module('users')
    .directive('upDownFlag', upDownFlag);

  upDownFlag.$inject = ['$compile', '$translate', '$filter'];

  function upDownFlag($compile, $translate, $filter) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.upDownFlag, function (s) {
        if (s) {
          var user = s;
          var titleu = $translate.instant('USER_UPLOADED_FLAG', {name: user.displayName});
          var titled = $translate.instant('USER_DOWNLOADED_FLAG', {name: user.displayName});
          var cls = attrs.upDownClass;

          console.log(user);
          var eu = angular.element('<span class="glyphicon glyphicon-arrow-up torrent-up" ng-click="$event.stopPropagation();"><span class="up-data">' + $filter('bytes')(user.uploaded) + '</span></span>');
          var ed = angular.element('<span class="glyphicon glyphicon-arrow-down torrent-down" ng-click="$event.stopPropagation();"><span class="down-data">' + $filter('bytes')(user.downloaded) + '</span></span>');

          eu.addClass(cls ? cls : '');
          ed.addClass(cls ? cls : '');
          eu.attr('title', titleu);
          ed.attr('title', titled);

          element.html(eu);
          element.append(ed);
          $compile(element.contents())(scope);
        }
      });
    }
  }
}());
