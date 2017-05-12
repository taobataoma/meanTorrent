(function () {
  'use strict';

  angular.module('core')
    .directive('menuTitle', menuTitle);

  menuTitle.$inject = ['$rootScope', '$interpolate', '$state', '$translate'];

  function menuTitle($rootScope, $interpolate, $state, $translate) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.menuTitle, function (title) {
        var menu_title = attrs.menuTitle;
        var trans = $translate.instant(menu_title);

        element.html(trans);
      });

      //scope.$on('$stateChangeSuccess', listener);
      //
      //function listener(event, toState) {
      //  var menu_title = attrs.menuTitle;
      //  var trans = $translate.instant(menu_title);
      //
      //  element.html(trans);
      //}
    }
  }
}());
