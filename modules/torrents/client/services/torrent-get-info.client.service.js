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
            result = item.resource_detail_info.original_title;
            break;
          case 'tvserial':
            result = item.resource_detail_info.original_name;
            break;
          case 'music':
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
            if (item.resource_detail_info.original_title !== item.resource_detail_info.title) {
              result = item.resource_detail_info.title;
            }
            break;
          case 'tvserial':
            if (item.resource_detail_info.original_name !== item.resource_detail_info.name) {
              result = item.resource_detail_info.name;
            }
            break;
        }
      }
      return result;
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
          case 'music':
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
          case 'music':
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
          case 'music':
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
          case 'music':
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
      if (item && item.resource_detail_info) {
        return item.resource_detail_info.vote_average ? voteTitleConfig.imdb : voteTitleConfig.mt;
      } else {
        return null;
      }
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
