(function () {
  'use strict';

  angular.module('users')
    .directive('torrentFileLink', torrentFileLink);

  torrentFileLink.$inject = ['$compile', '$translate', 'MeanTorrentConfig'];

  function torrentFileLink($compile, $translate, MeanTorrentConfig) {
    var appConfig = MeanTorrentConfig.meanTorrentConfig.app;

    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.torrentFileLink, function (s) {
        if (s) {
          var torrent = s;
          var user = scope.$eval(attrs.torrentUser);

          if (user && torrent) {
            var link = makeTorrentFileLink(torrent, user);
            var title = $translate.instant('COPY_LINK_TO_CLIPBOARD');
            var cls = attrs.infoClass;
            var e = angular.element('<i class="fa fa-link torrent-file-link" ng-click="$event.stopPropagation();" mt-rotate-by-mouse="{duration: \'.3s\'}" mt-copy-to-clipboard="' + link + '"></i>');

            if (e) {
              e.addClass(cls ? cls : '');
              e.attr('title', title);

              element.html(e);
              $compile(element.contents())(scope);
            }
          }
        }
      });
    }

    function makeTorrentFileLink(t, u) {
      var link = appConfig.domain;
      link += '/api/torrents/download';
      link += '/' + t._id;
      link += '/' + u.passkey;

      return link;
    }
  }

  //==============================================================

  angular.module('users')
    .directive('torrentFileLinkLabel', torrentFileLinkLabel);

  torrentFileLinkLabel.$inject = ['$compile', '$translate', 'MeanTorrentConfig'];

  function torrentFileLinkLabel($compile, $translate, MeanTorrentConfig) {
    var appConfig = MeanTorrentConfig.meanTorrentConfig.app;

    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.torrentFileLinkLabel, function (s) {
        if (s) {
          var torrent = s;
          var user = scope.$eval(attrs.torrentUser);

          if (user && torrent) {
            var link = makeTorrentFileLink(torrent, user);
            var txt = $translate.instant('TORRENT_LABEL_LINK');
            var title = $translate.instant('COPY_LINK_TO_CLIPBOARD');
            var cls = attrs.infoClass;
            var e = angular.element('<span class="label" ng-click="$event.stopPropagation();" mt-copy-to-clipboard="' + link + '"><i class="fa fa-copy margin-right-3"></i>' + txt + '</span>');

            if (e) {
              e.addClass(cls ? cls : '');
              e.attr('title', title);

              element.html(e);
              $compile(element.contents())(scope);
            }
          }
        }
      });
    }

    function makeTorrentFileLink(t, u) {
      var link = appConfig.domain;
      link += '/api/torrents/download';
      link += '/' + t._id;
      link += '/' + u.passkey;

      return link;
    }
  }

  //================================================================

  angular.module('users')
    .directive('torrentFileLinkButton', torrentFileLinkButton);

  torrentFileLinkButton.$inject = ['$compile', '$translate', 'MeanTorrentConfig'];

  function torrentFileLinkButton($compile, $translate, MeanTorrentConfig) {
    var appConfig = MeanTorrentConfig.meanTorrentConfig.app;

    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.torrentFileLinkButton, function (s) {
        if (s) {
          var torrent = s;
          var user = scope.$eval(attrs.torrentUser);

          if (user && torrent) {
            var link = makeTorrentFileLink(torrent, user);
            var text = $translate.instant('COPY_LINK_TEXT');
            var cls = attrs.infoClass;
            var e = angular.element('<button class="btn" ng-click="$event.stopPropagation();" mt-copy-to-clipboard="' + link + '">' + text + '</button>');

            if (e) {
              e.addClass(cls ? cls : '');

              element.html(e);
              $compile(element.contents())(scope);
            }
          }
        }
      });
    }

    function makeTorrentFileLink(t, u) {
      var link = appConfig.domain;
      link += '/api/torrents/download';
      link += '/' + t._id;
      link += '/' + u.passkey;

      return link;
    }
  }
}());
