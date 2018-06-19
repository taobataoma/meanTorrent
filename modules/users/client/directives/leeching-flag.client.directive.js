(function () {
  'use strict';

  angular.module('users')
    .directive('leechingFlag', leechingFlag);

  leechingFlag.$inject = ['$compile', '$translate', '$filter'];

  function leechingFlag($compile, $translate, $filter) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.leechingFlag, function (s) {
        if (s) {
          var user = s;
          var title = $translate.instant('USER_LEECHING_FLAG', {name: user.displayName});
          var cls = attrs.leechingFlagClass;

          var ele = angular.element('<i class="fas fa-angle-double-down text-mt" ng-click="$event.stopPropagation();"> <span class="leeching-data">' + user.leeched + '</span></i>');

          ele.addClass(cls ? cls : '');
          ele.attr('title', title);

          element.append(ele);
          $compile(element.contents())(scope);
        }
      });
    }
  }
}());
