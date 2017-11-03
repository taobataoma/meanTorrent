(function () {
  'use strict';

  angular.module('core')
    .directive('torrentProgress', torrentProgress);

  torrentProgress.$inject = ['$compile', 'DebugConsoleService', 'ngProgressFactory'];

  function torrentProgress($compile, mtDebug, ngProgressFactory) {
    var PEERSTATE_SEEDER = 'seeder';
    var PEERSTATE_LEECHER = 'leecher';

    var directive = {
      restrict: 'A',
      replace: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.torrentProgress, function (p) {
        if (p && p.length > 0) {
          var pt = p[0];
          //mtDebug.info(pt);

          var t_progressbar = ngProgressFactory.createInstance();
          t_progressbar.setParent(element[0]);
          t_progressbar.setAbsolute();
          t_progressbar.setHeight('2px');
          if (pt.peer_status === PEERSTATE_SEEDER) {
            t_progressbar.set(100);
            t_progressbar.setColor('#ff6600');
          } else {
            t_progressbar.set(pt.peer_percent);
            t_progressbar.setColor('#5cb85c');
          }
          t_progressbar.progressbarEl.css('background-color', '#dedede');
          t_progressbar.progressbarEl.css('top', '-5px');
          t_progressbar.progressbarEl.css('left', '8px');
          t_progressbar.progressbarEl.css('right', '8px');

          //element.css('margin-bottom', '8px');
          //console.log(t_progressbar);
        }
      });
    }
  }


  angular.module('core')
    .directive('cardProgress', cardProgress);

  cardProgress.$inject = ['$compile', 'DebugConsoleService', 'ngProgressFactory'];

  function cardProgress($compile, mtDebug, ngProgressFactory) {
    var PEERSTATE_SEEDER = 'seeder';
    var PEERSTATE_LEECHER = 'leecher';

    var directive = {
      restrict: 'A',
      replace: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.cardProgress, function (p) {
        if (p && p.length > 0) {
          var pt = p[0];
          //mtDebug.info(pt);

          var t_progressbar = ngProgressFactory.createInstance();
          t_progressbar.setParent(element[0]);
          t_progressbar.setAbsolute();
          t_progressbar.setHeight('2px');
          if (pt.peer_status === PEERSTATE_SEEDER) {
            t_progressbar.set(100);
            t_progressbar.setColor('#ff6600');
          } else {
            t_progressbar.set(pt.peer_percent);
            t_progressbar.setColor('#5cb85c');
          }
          t_progressbar.progressbarEl.css('background-color', '#dedede');
          t_progressbar.progressbarEl.css('top', '0');
          //t_progressbar.progressbarEl.css('left', '8px');
          //t_progressbar.progressbarEl.css('right', '8px');

          //element.css('margin-bottom', '8px');
          //console.log(t_progressbar);
        }
      });
    }
  }
}());
