(function () {
  'use strict';

  angular
    .module('torrents.services')
    .factory('ScrapeService', ScrapeService);

  ScrapeService.$inject = ['TorrentsService', '$timeout'];

  function ScrapeService(TorrentsService, $timeout) {

    return {
      scrapeTorrent: scrapeTorrent
    };

    function scrapeTorrent(obj) {
      if (Array.isArray(obj)) {
        angular.forEach(obj, function (oi) {
          $timeout(function () {
            TorrentsService.scrape({
              torrentId: oi._id
            }, function (scinfo) {
              console.log(scinfo);
              oi.torrent_seeds = scinfo.data.complete;
              oi.torrent_finished = scinfo.data.downloaded;
              oi.torrent_leechers = scinfo.data.incomplete;
            });
          }, 10);
        });
      } else {
        $timeout(function () {
          TorrentsService.scrape({
            torrentId: obj._id
          }, function (scinfo) {
            console.log(scinfo);
            obj.torrent_seeds = scinfo.data.complete;
            obj.torrent_finished = scinfo.data.downloaded;
            obj.torrent_leechers = scinfo.data.incomplete;
          });
        }, 10);
      }
    }
  }
}());
