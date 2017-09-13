(function () {
  'use strict';

  angular
    .module('core')
    .directive('filestyle', filestyle);

  filestyle.$inject = ['$timeout', '$window'];

  function filestyle($timeout, $window) {
    var directive = {
      restrict: 'AC',
      scope: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      var options = {
        'input': attrs.input === 'false' ? false : true,
        'icon': attrs.icon === 'false' ? false : true,
        'buttonBefore': attrs.buttonbefore === 'true' ? true : false,
        'disabled': attrs.disabled === 'true' ? true : false,
        'size': attrs.size,
        'buttonText': attrs.buttontext,
        'buttonName': attrs.buttonname,
        'iconName': attrs.iconname,
        'badge': attrs.badge === 'false' ? false : true,
        'placeholder': attrs.placeholder
      };
      element.filestyle(options);
    }
  }
}());
