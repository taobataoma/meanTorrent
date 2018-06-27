(function () {
  'use strict';

  angular.module('users')
    .directive('torrentFileDownloadLink', torrentFileDownloadLink);

  torrentFileDownloadLink.$inject = ['$compile', '$translate', 'MeanTorrentConfig'];

  function torrentFileDownloadLink($compile, $translate, MeanTorrentConfig) {
    var appConfig = MeanTorrentConfig.meanTorrentConfig.app;

    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.torrentFileDownloadLink, function (s) {
        if (s) {
          var torrent = s;

          if (torrent) {
            var txt = $translate.instant('TORRENT_DOWNLOAD_LINK');
            var cls = attrs.infoClass;
            var e = angular.element('<span class="label" ng-click="vm.DLS.downloadTorrent(item._id); $event.stopPropagation();"><i class="fa fa-arrow-circle-down margin-right-3"></i>' + txt + '</span>');

            if (e) {
              e.addClass(cls ? cls : '');

              element.html(e);
              $compile(element.contents())(scope);
            }
          }
        }
      });
    }
  }
}());
