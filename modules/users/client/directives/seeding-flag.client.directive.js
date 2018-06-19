(function () {
  'use strict';

  angular.module('users')
    .directive('seedingFlag', seedingFlag);

  seedingFlag.$inject = ['$compile', '$translate', '$filter'];

  function seedingFlag($compile, $translate, $filter) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.seedingFlag, function (s) {
        if (s) {
          var user = s;
          var title = $translate.instant('USER_SEEDING_FLAG', {name: user.displayName});
          var cls = attrs.seedingFlagClass;

          var ele = angular.element('<i class="fas fa-seedling text-mt" ng-click="$event.stopPropagation();"> <span class="seeding-data">' + user.seeded + '</span></i>');

          ele.addClass(cls ? cls : '');
          ele.attr('title', title);

          element.append(ele);
          $compile(element.contents())(scope);
        }
      });
    }
  }
}());
