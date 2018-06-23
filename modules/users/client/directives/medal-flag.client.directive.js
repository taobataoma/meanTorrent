(function () {
  'use strict';

  angular.module('users')
    .directive('medalFlag', medalFlag);

  medalFlag.$inject = ['$compile', '$translate', '$filter'];

  function medalFlag($compile, $translate, $filter) {
    var user = undefined;

    var directive = {
      restrict: 'A',
      replace: true,
      scope: {
        medalUser: '=medalFlag',
        medalCount: '=medalCount'
      },
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(function () {
        var number = scope.medalCount || 0;
        var title = $translate.instant('USER_MEDAL_FLAG', {name: scope.medalUser.displayName});
        var cls = attrs.medalFlagClass;

        var ele = angular.element('<i class="far fa-shield-alt text-mt" ng-click="$event.stopPropagation();"> <span class="medal-data">' + number + '</span></i>');

        ele.addClass(cls ? cls : '');
        ele.attr('title', title);

        element.html(ele);
        $compile(element.contents())(scope);
      });
    }
  }
}());
