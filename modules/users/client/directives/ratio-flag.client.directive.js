(function () {
  'use strict';

  angular.module('users')
    .directive('ratioFlag', ratioFlag);

  ratioFlag.$inject = ['$compile', '$translate', '$filter'];

  function ratioFlag($compile, $translate, $filter) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.ratioFlag, function (s) {
        if (s) {
          var user = s;
          var title = $translate.instant('USER_RATIO_FLAG', {name: user.displayName});
          var cls = attrs.ratioFlagClass;

          var ele = angular.element('<i class="fas fa-hands text-mt" ng-click="$event.stopPropagation();"> <span class="ratio-data">' + $filter('ratio')(user.ratio, 2) + '</span></i>');

          ele.addClass(cls ? cls : '');
          ele.attr('title', title);

          element.append(ele);
          $compile(element.contents())(scope);
        }
      });
    }
  }
}());
