(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('torrents.services')
    .factory('TorrentGetInfoServices', TorrentGetInfoServices);

  TorrentGetInfoServices.$inject = ['MeanTorrentConfig'];

  function TorrentGetInfoServices(MeanTorrentConfig) {
    var voteTitleConfig = MeanTorrentConfig.meanTorrentConfig.voteTitle;
    var tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;

    var service = {
      getTorrentTitle: getTorrentTitle,
      getTorrentOriginalTitle: getTorrentOriginalTitle,
      getTorrentDoubleTitle: getTorrentDoubleTitle,
      getTorrentListImage: getTorrentListImage,
      getTorrentListTopImage: getTorrentListTopImage,
      getTorrentTopOneImage: getTorrentTopOneImage,
      getTorrentBackdropImage: getTorrentBackdropImage,
      getVoteTitle: getVoteTitle,
      getMovieDirector: getMovieDirector,
      getTorrentLanguage: getTorrentLanguage,
      getTorrentOverview: getTorrentOverview
    };

    return service;


    /**
     * getTorrentTitle
     * @param item
     * @returns {string}
     */
    function getTorrentTitle(item) {
      var result = null;

      if (item && item.resource_detail_info) {
        switch (item.torrent_type) {
          case 'movie':
            result = item.resource_detail_info.title;
            break;
          case 'tvserial':
            result = item.resource_detail_info.name;
            break;
          default:
            result = item.resource_detail_info.title;
            break;
        }
      }
      return result;
    }

    /**
     * getTorrentOriginalTitle
     * @param item
     * @returns {string}
     */
    function getTorrentOriginalTitle(item) {
      var result = null;

      if (item && item.resource_detail_info) {
        switch (item.torrent_type) {
          case 'movie':
            result = item.resource_detail_info.original_title;
            break;
          case 'tvserial':
            result = item.resource_detail_info.original_name;
            break;
          default:
            result = item.resource_detail_info.title;
        }
      }
      return result;
    }

    /**
     * getTorrentDoubleTitle
     * @param item
     * @returns {string}
     */
    function getTorrentDoubleTitle(item) {
      var ori = getTorrentOriginalTitle(item);
      var t = getTorrentTitle(item);

      return ori === t ? t : t + ' / ' + ori;
    }

    /**
     * getTorrentListImage
     * @param item
     * @returns {string}
     */
    function getTorrentListImage(item) {
      var result = null;

      if (item && item.resource_detail_info) {
        switch (item.torrent_type) {
          case 'movie':
          case 'tvserial':
            result = tmdbConfig.posterListBaseUrl + item.resource_detail_info.poster_path;
            break;
          default:
            result = '/modules/torrents/client/uploads/cover/' + item.resource_detail_info.cover;
            break;
        }
      }
      return result;
    }

    /**
     * getTorrentListTopImage
     * @param item
     * @returns {string}
     */
    function getTorrentListTopImage(item) {
      var result = null;

      if (item && item.resource_detail_info) {
        switch (item.torrent_type) {
          case 'movie':
          case 'tvserial':
            result = tmdbConfig.posterImgBaseUrl + item.resource_detail_info.poster_path;
            break;
          default:
            result = '/modules/torrents/client/uploads/cover/' + item.resource_detail_info.cover;
            break;
        }
      }
      return result;
    }

    /**
     * getTorrentTopOneImage
     * @param item
     * @returns {string}
     */
    function getTorrentTopOneImage(item) {
      var result = null;

      if (item && item.resource_detail_info) {
        switch (item.torrent_type) {
          case 'movie':
          case 'tvserial':
            result = tmdbConfig.posterImgBaseUrl + item.resource_detail_info.poster_path;
            break;
          default:
            result = '/modules/torrents/client/uploads/cover/' + item.resource_detail_info.cover;
            break;
        }
      }
      return result;
    }

    /**
     * getTorrentBackdropImage
     * @param item
     * @returns {string}
     */
    function getTorrentBackdropImage(item) {
      var result = null;

      if (item && item.resource_detail_info) {
        switch (item.torrent_type) {
          case 'movie':
          case 'tvserial':
            result = tmdbConfig.backdropImgBaseUrl + item.resource_detail_info.backdrop_path;
            break;
          default:
            result = '/modules/torrents/client/uploads/cover/' + item.resource_detail_info.cover;
            break;
        }
      }
      return result;
    }

    /**
     * getVoteTitle
     * @param item
     * @returns {string}
     */
    function getVoteTitle(item) {
      var result = null;

      if (item && item.resource_detail_info) {
        switch (item.torrent_type) {
          case 'movie':
          case 'tvserial':
            result = voteTitleConfig.imdb;
            break;
          default :
            result = voteTitleConfig.mt;
            break;
        }
      } else {
        result = voteTitleConfig.mt;
      }
      return result;
    }

    /**
     * getMovieDirector
     * @param item
     * @returns {n}
     */
    function getMovieDirector(item) {
      var result = null;

      if (item && item.resource_detail_info && item.resource_detail_info.credits) {
        angular.forEach(item.resource_detail_info.credits.crew, function (sitem) {
          if (sitem.job === 'Director') {
            result = sitem.name;
          }
        });
      }
      return result;
    }

    /**
     * getTorrentLanguage
     * @param item
     * @returns {*}
     */
    function getTorrentLanguage(item) {
      var result = null;

      if (item && item.resource_detail_info) {
        result = item.resource_detail_info.original_language;
      }
      return result;
    }

    /**
     * getTorrentOverview
     * @param item
     * @returns {*}
     */
    function getTorrentOverview(item) {
      var result = null;

      if (item && item.resource_detail_info) {
        result = item.resource_detail_info.overview || item.resource_detail_info.detail || null;
      }
      return result;
    }
  }
}());
