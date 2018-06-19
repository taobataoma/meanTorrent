(function () {
  'use strict';

  angular.module('users')
    .directive('medalFlag', medalFlag);

  medalFlag.$inject = ['$compile', '$translate', '$filter'];

  function medalFlag($compile, $translate, $filter) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.medalFlag, function (s) {
        if (s) {
          var user = s;
          var number = attrs.medalCount || 0;
          var title = $translate.instant('USER_MEDAL_FLAG', {name: user.displayName});
          var cls = attrs.medalFlagClass;

          var ele = angular.element('<i class="far fa-shield-alt text-mt" ng-click="$event.stopPropagation();"> <span class="medal-data">' + number + '</span></i>');

          ele.addClass(cls ? cls : '');
          ele.attr('title', title);

          element.append(ele);
          $compile(element.contents())(scope);
        }
      });
    }
  }
}());
