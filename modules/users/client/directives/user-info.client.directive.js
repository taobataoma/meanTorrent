(function () {
  'use strict';

  angular.module('users')
    .directive('userInfo', userInfo);

  userInfo.$inject = ['$compile', '$translate', 'Authentication'];

  function userInfo($compile, $translate, Authentication) {
    var me = Authentication.user;

    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.userInfo, function (s) {
        if (s) {
          var user = s;
          var title = $translate.instant('USER_INFO_TITLE', {name: user.displayName});
          var cls = attrs.infoClass;
          var e = undefined;

          var state = me._id === user._id ? ('status.account') : ('userinfo({userId: \'' + user._id + '\'})');

          if (attrs.hasOwnProperty('infoName')) {
            e = angular.element('<a href="#" ui-sref="' + state + '" ng-click="$event.stopPropagation();">' + user.displayName + '</a>');
          } else if (attrs.hasOwnProperty('infoUname')) {
            e = angular.element('<a href="#" ui-sref="' + state + '" ng-click="$event.stopPropagation();">' + user.username + '</a>');
          } else if (attrs.hasOwnProperty('infoAvatar')) {
            e = angular.element('<a href="#" ui-sref="' + state + '" ng-click="$event.stopPropagation();"><img src="' + user.profileImageURL + '"></a>');
          }
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
