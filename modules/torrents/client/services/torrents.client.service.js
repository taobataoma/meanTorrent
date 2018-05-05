(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('torrents.services')
    .factory('TorrentsService', TorrentsService);

  TorrentsService.$inject = ['$resource', 'CacheFactory'];

  function TorrentsService($resource, CacheFactory) {
    var torrentsCache = CacheFactory.get('torrentsCache') || CacheFactory.createCache('torrentsCache');
    var removeCache = function (res) {
      torrentsCache.removeAll();
      return res.resource;
    };

    var Torrents = $resource('/api/torrents/:torrentId', {
      torrentId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: torrentsCache
      },
      query: {
        method: 'GET',
        cache: torrentsCache
      },
      update: {
        method: 'PUT',
        interceptor: {response: removeCache}
      },
      save: {
        method: 'POST',
        interceptor: {response: removeCache}
      },
      remove: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      delete: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      getTMDBMovieInfo: {
        method: 'GET',
        url: '/api/movieinfo/:tmdbid/:language',
        params: {
          tmdbid: '@tmdbid',
          language: '@language'
        }
      },
      searchMovie: {
        method: 'GET',
        url: '/api/search/movie/:language',
        params: {
          language: '@language'
        }
      },
      getTMDBTVInfo: {
        method: 'GET',
        url: '/api/tvinfo/:tmdbid/:language',
        params: {
          tmdbid: '@tmdbid',
          language: '@language'
        }
      },
      setSaleType: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/set/saletype/:saleType',
        params: {
          torrentId: '@_torrentId',
          saleType: '@_saleType'
        },
        interceptor: {response: removeCache}
      },
      setRecommendLevel: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/set/recommendlevel/:rlevel',
        params: {
          torrentId: '@_torrentId',
          rlevel: '@_rlevel'
        },
        interceptor: {response: removeCache}
      },
      setTorrentTags: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/set/tags',
        params: {
          torrentId: '@_torrentId'
        },
        interceptor: {response: removeCache}
      },
      setReviewedStatus: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/set/reviewed',
        params: {
          torrentId: '@_torrentId'
        },
        interceptor: {response: removeCache}
      },
      toggleHnRStatus: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/toggleHnRStatus',
        params: {
          torrentId: '@_id'
        },
        interceptor: {response: removeCache}
      },
      toggleVIPStatus: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/toggleVIPStatus',
        params: {
          torrentId: '@_id'
        },
        interceptor: {response: removeCache}
      },
      toggleTopStatus: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/toggleTOPStatus',
        params: {
          torrentId: '@_id'
        },
        interceptor: {response: removeCache}
      },
      thumbsUp: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/thumbsUp',
        params: {
          torrentId: '@_id'
        },
        interceptor: {response: removeCache}
      },
      rating: {
        method: 'PUT',
        url: '/api/torrents/:torrentId/rating',
        params: {
          torrentId: '@_id'
        },
        interceptor: {response: removeCache}
      },
      siteInfo: {
        method: 'GET',
        url: '/api/torrents/siteInfo',
        cache: torrentsCache
      },
      getSeederUsers: {
        method: 'GET',
        url: '/api/torrents/:torrentId/seederUsers',
        params: {
          torrentId: '@_id'
        },
        cache: torrentsCache
      },
      getLeecherUsers: {
        method: 'GET',
        url: '/api/torrents/:torrentId/leecherUsers',
        params: {
          torrentId: '@_id'
        },
        cache: torrentsCache
      },
      getHomeTorrent: {
        method: 'GET',
        url: '/api/torrents/homeList',
        cache: torrentsCache
      }
    });

    return Torrents;
  }
}());
