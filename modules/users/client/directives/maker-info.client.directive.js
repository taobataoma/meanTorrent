(function () {
  'use strict';

  angular.module('users')
    .directive('makerInfo', makerInfo);

  makerInfo.$inject = ['$compile', '$translate'];

  function makerInfo($compile, $translate) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.makerInfo, function (s) {
        if (s) {
          var maker = s;
          var title = $translate.instant('MAKER_INFO_TITLE', {name: maker.name});
          var cls = attrs.infoClass;
          var e = angular.element('<a href="#" ui-sref="about.group({makerId: \'' + maker._id + '\'})" ng-click="$event.stopPropagation();">-=' + maker.name + '=-</a>');

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
