(function () {
  'use strict';

  angular.module('users')
    .directive('ipFlag', ipFlag);

  ipFlag.$inject = ['$compile', '$translate'];

  function ipFlag($compile, $translate) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.ipFlag, function (s) {
        if (s) {
          var peer = s;
          var cls = attrs.ipClass;

          var e = angular.element('<span></span>');
          var e4 = angular.element('<span class="ip-flag4" ng-click="$event.stopPropagation();" uib-tooltip="{{ \'USER_IP_V4\' | translate}}">4</span>');
          var e6 = angular.element('<span class="ip-flag6" ng-click="$event.stopPropagation();" uib-tooltip="{{ \'USER_IP_V6\' | translate}}">6</span>');

          if (e) {
            if (peer.peer_ipv4 !== '') {
              e4.addClass(cls ? cls : '');
              e.append(e4);
            }
            if (peer.peer_ipv6 !== '') {
              e6.addClass(cls ? cls : '');
              e.append(e6);
            }
            element.html(e);
            $compile(element.contents())(scope);
          }
        }
      });
    }
  }
}());
