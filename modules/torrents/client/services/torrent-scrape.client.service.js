(function () {
  'use strict';

  angular
    .module('torrents.services')
    .factory('ScrapeService', ScrapeService);

  ScrapeService.$inject = ['TorrentsService', '$timeout', 'moment', 'MeanTorrentConfig', 'DebugConsoleService'];

  function ScrapeService(TorrentsService, $timeout, moment, MeanTorrentConfig, mtDebug) {
    var scrapeConfig = MeanTorrentConfig.meanTorrentConfig.scrapeTorrentStatus;

    return {
      scrapeTorrent: scrapeTorrent
    };

    function scrapeTorrent(obj) {
      if (Array.isArray(obj)) {
        angular.forEach(obj, function (oi) {
          var h = moment().diff(moment(oi.last_scrape), 'hours');

          if (h >= scrapeConfig.scrapeInterval) {
            $timeout(function () {
              TorrentsService.scrape({
                torrentId: oi._id
              }, function (scinfo) {
                mtDebug.info(scinfo);
                oi.torrent_seeds = scinfo.data.complete;
                oi.torrent_finished = scinfo.data.downloaded;
                oi.torrent_leechers = scinfo.data.incomplete;
              });
            }, 10);
          }
        });
      } else {
        var h = moment().diff(moment(obj.last_scrape), 'hours');

        if (h >= scrapeConfig.scrapeInterval) {
          $timeout(function () {
            TorrentsService.scrape({
              torrentId: obj._id
            }, function (scinfo) {
              mtDebug.info(scinfo);
              obj.torrent_seeds = scinfo.data.complete;
              obj.torrent_finished = scinfo.data.downloaded;
              obj.torrent_leechers = scinfo.data.incomplete;
            });
          }, 10);
        }
      }
    }
  }
}());
