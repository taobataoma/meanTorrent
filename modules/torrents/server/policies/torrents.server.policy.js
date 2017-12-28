'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Torrents Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow(
    [
      {
        roles: ['admin', 'oper'],
        allows: [
          {resources: '/api/movieinfo/:tmdbid/:language', permissions: '*'},
          {resources: '/api/tvinfo/:tmdbid/:language', permissions: '*'},
          {resources: '/api/search/movie/:language', permissions: '*'},
          {resources: '/api/torrents/upload', permissions: '*'},
          {resources: '/api/torrents/uploadTorrentCover', permissions: '*'},
          {resources: '/api/torrents/uploadTorrentImage', permissions: '*'},
          {resources: '/api/torrents/announceEdit', permissions: '*'},
          {resources: '/api/torrents/download/:torrentId', permissions: '*'},
          {resources: '/api/torrents/download/:torrentId/:passkey', permissions: '*'},
          {resources: '/api/torrents', permissions: '*'},
          {resources: '/api/rss/:passkey', permissions: '*'},
          {resources: '/api/torrents/homeList', permissions: '*'},
          {resources: '/api/torrents/:torrentId', permissions: '*'},
          {resources: '/api/torrents/:torrentId/thumbsUp', permissions: '*'},
          {resources: '/api/torrents/:torrentId/rating', permissions: '*'},
          {resources: '/api/torrents/:torrentId/scrape', permissions: '*'},
          {resources: '/api/torrents/:torrentId/seederUsers', permissions: '*'},
          {resources: '/api/torrents/:torrentId/leecherUsers', permissions: '*'},
          {resources: '/api/torrents/:torrentId/toggleHnRStatus', permissions: '*'},
          {resources: '/api/torrents/:torrentId/toggleVIPStatus', permissions: '*'},
          {resources: '/api/torrents/:torrentId/set/saletype/:saleType', permissions: '*'},
          {resources: '/api/torrents/:torrentId/set/recommendlevel/:rlevel', permissions: '*'},
          {resources: '/api/torrents/:torrentId/set/reviewed', permissions: '*'},
          {resources: '/api/torrents/:torrentId/set/tags', permissions: '*'},

          {resources: '/api/subtitles/:torrentId', permissions: '*'},
          {resources: '/api/subtitles/:torrentId/:subtitleId', permissions: '*'},

          {resources: '/api/comments/:torrentId', permissions: '*'},
          {resources: '/api/comments/:torrentId/:commentId', permissions: '*'},
          {resources: '/api/comments/:torrentId/:commentId/:subCommentId', permissions: '*'},

          {resources: '/api/my/seeding', permissions: '*'},
          {resources: '/api/my/downloading', permissions: '*'},
          {resources: '/api/my/warning', permissions: '*'},
          {resources: '/api/torrents/siteInfo', permissions: ['get']},

          {resources: '/api/completes/:completeId', permissions: ['put']}
        ]
      },
      {
        roles: ['user'],
        allows: [
          {resources: '/api/movieinfo/:tmdbid/:language', permissions: ['get']},
          {resources: '/api/tvinfo/:tmdbid/:language', permissions: ['get']},
          {resources: '/api/search/movie/:language', permissions: ['get']},
          {resources: '/api/torrents/upload', permissions: ['post']},
          {resources: '/api/torrents/uploadTorrentCover', permissions: ['post']},
          {resources: '/api/torrents/uploadTorrentImage', permissions: ['post']},
          {resources: '/api/torrents/download/:torrentId', permissions: ['get']},
          {resources: '/api/torrents/download/:torrentId/:passkey', permissions: ['get']},
          {resources: '/api/torrents', permissions: ['get', 'post']},
          {resources: '/api/rss/:passkey', permissions: ['get']},
          {resources: '/api/torrents/homeList', permissions: ['get']},
          {resources: '/api/torrents/:torrentId', permissions: ['get', 'put']},
          {resources: '/api/torrents/:torrentId/thumbsUp', permissions: ['put']},
          {resources: '/api/torrents/:torrentId/rating', permissions: ['put']},
          {resources: '/api/torrents/:torrentId/scrape', permissions: ['get']},
          {resources: '/api/torrents/:torrentId/seederUsers', permissions: ['get']},
          {resources: '/api/torrents/:torrentId/leecherUsers', permissions: ['get']},

          {resources: '/api/subtitles/:torrentId', permissions: ['post']},
          {resources: '/api/subtitles/:torrentId/:subtitleId', permissions: ['get', 'delete']},

          {resources: '/api/comments/:torrentId', permissions: ['post']},
          {resources: '/api/comments/:torrentId/:commentId', permissions: ['post', 'put', 'delete']},
          {resources: '/api/comments/:torrentId/:commentId/:subCommentId', permissions: ['put', 'delete']},

          {resources: '/api/my/seeding', permissions: ['get']},
          {resources: '/api/my/downloading', permissions: ['get']},
          {resources: '/api/my/warning', permissions: ['get']},
          {resources: '/api/torrents/siteInfo', permissions: ['get']},

          {resources: '/api/completes/:completeId', permissions: ['put']}
        ]
      },
      {
        roles: ['guest'],
        allows: [
          {resources: '/api/movieinfo/:tmdbid/:language', permissions: ['get']},
          {resources: '/api/tvinfo/:tmdbid/:language', permissions: ['get']},
          {resources: '/api/search/movie/:language', permissions: ['get']},
          {resources: '/api/torrents', permissions: ['get']},
          {resources: '/api/rss/:passkey', permissions: ['get']},
          {resources: '/api/torrents/homeList', permissions: ['get']},
          {resources: '/api/torrents/:torrentId', permissions: ['get']},
          {resources: '/api/torrents/:torrentId/seederUsers', permissions: ['get']},
          {resources: '/api/torrents/:torrentId/leecherUsers', permissions: ['get']},
          {resources: '/api/torrents/siteInfo', permissions: ['get']},
          {resources: '/api/torrents/download/:torrentId/:passkey', permissions: ['get']}
        ]
      }
    ]
  );
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
