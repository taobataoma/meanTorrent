(function () {
  'use strict';

  angular.module('core')
    .directive('messageTo', messageTo);

  messageTo.$inject = ['$compile', '$translate'];

  function messageTo($compile, $translate) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.messageTo, function (s) {
        var user = s;
        var to = user._id + '|' + user.displayName;
        var title = $translate.instant('MESSAGE_TO_ICON_TITLE');
        var e = $compile('<a href="#"><i class="glyphicon glyphicon-envelope" ng-click="$event.stopPropagation();" ui-sref="messages.send({to: \'' + to + '\'})"></i></a>')(scope);

        e.attr('title', title);

        if (attrs.toClass) {
          e.addClass(attrs.toClass);
        } else {
          e.css('font-size', '12px');
          e.css('margin-left', '10px');
        }

        if (element[0].firstChild) {
          if (element[0].firstChild.nodeName === '#text') {
            angular.element(element[0].firstChild).after(e);
          }
        } else {
          angular.element(element[0]).append(e);
        }
      });
    }
  }
}());
