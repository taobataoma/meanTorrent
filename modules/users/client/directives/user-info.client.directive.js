(function () {
  'use strict';

  angular.module('users')
    .directive('userInfo', userInfo);

  userInfo.$inject = ['$compile', '$translate'];

  function userInfo($compile, $translate) {
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
          var e = angular.element('<a href="#" class="' + (cls ? cls : "") + '" ui-sref="userinfo({userId: \'' + user._id + '\'})" title="' + title + '">' + element[0].innerHTML + '</a>');
          element.html(e[0].outerHTML);
          $compile(element.contents())(scope);
        }
      });
    }
  }
}());
