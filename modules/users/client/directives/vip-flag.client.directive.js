(function () {
  'use strict';

  angular.module('users')
    .directive('vipFlag', vipFlag);

  vipFlag.$inject = ['$compile', '$translate'];

  function vipFlag($compile, $translate) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.vipFlag, function (s) {
        if (s) {
          var user = s;
          var title = $translate.instant('USER_IS_VIP', {name: user.displayName});
          var cls = attrs.vipClass;

          var e = angular.element('<span class="vip-flag" ng-click="$event.stopPropagation();"><kbd>VIP</kbd></span>');

          if (e) {
            if (user.isVip) {
              e.addClass(cls ? cls : '');
              e.attr('title', title);

              element.html(e);
              $compile(element.contents())(scope);
            } else {
              element.html('');
            }
          }
        }
      });
    }
  }
}());
