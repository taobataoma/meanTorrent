(function () {
  'use strict';

  angular.module('core')
    .directive('pageTitle', pageTitle);

  pageTitle.$inject = ['$rootScope', '$interpolate', '$state', '$translate', 'MeanTorrentConfig'];

  function pageTitle($rootScope, $interpolate, $state, $translate, MeanTorrentConfig) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element) {
      $rootScope.$on('$stateChangeSuccess', listener);

      function listener(event, toState) {
        var appConfig = MeanTorrentConfig.meanTorrentConfig.app;
        var applicationCoreTitle = appConfig.name,
          separeteBy = ' - ';
        if (toState.data && toState.data.pageTitle) {
          var stateTitle = $interpolate(toState.data.pageTitle)($state.$current.locals.globals);
          element.html(applicationCoreTitle + separeteBy + $translate.instant(stateTitle));
        } else {
          element.html(applicationCoreTitle);
        }
      }
    }
  }
}());
