'use strict';

var commonEnvConfig = require('./comm-variable');

module.exports = {
  app: {
    title: commonEnvConfig.variable.site.site_title,
    description: commonEnvConfig.variable.site.site_description,
    keywords: commonEnvConfig.variable.site.site_keywords,
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  db: {
    promise: global.Promise
  },
  port: process.env.PORT || commonEnvConfig.variable.site.site_port,
  host: process.env.HOST || commonEnvConfig.variable.site.site_host,
  // DOMAIN config should be set to the fully qualified application accessible
  // URL. For example: https://www.myapp.com (including port if required).
  domain: process.env.DOMAIN || commonEnvConfig.variable.site.site_domain,
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || commonEnvConfig.variable.site.site_sessionSecret,
  // sessionKey is the cookie session name
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  illegalUsernames: ['meanjs', 'administrator', 'password', 'admin', 'user', 'mean', 'meanTorrent', 'torrent', 'bit', 'bits', 'oper', 'operator',
    'unknown', 'anonymous', 'null', 'undefined', 'api'
  ],
  aws: {
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      bucket: process.env.S3_BUCKET
    }
  },
  uploads: {
    // Storage can be 'local' or 's3'
    storage: process.env.UPLOADS_STORAGE || 'local',
    profile: {
      image: {
        dest: './modules/users/client/img/profile/uploads/',
        limits: {
          fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      }
    },
    torrent: {
      file: {
        dest: './modules/torrents/client/uploads/',
        temp: './modules/torrents/client/uploads/temp/',
        limits: {
          fileSize: 2 * 1024 * 1024 // Max file size in bytes (2 MB)
        }
      },
      cover: {
        dest: './modules/torrents/client/uploads/cover/',
        crop: './modules/torrents/client/uploads/cover/crop/',
        temp: './modules/torrents/client/uploads/temp/',
        limits: {
          fileSize: 2 * 1024 * 1024 // Max file size in bytes (2 MB)
        }
      },
      image: {
        dest: './modules/torrents/client/uploads/image/',
        crop: './modules/torrents/client/uploads/image/crop/',
        temp: './modules/torrents/client/uploads/temp/',
        limits: {
          fileSize: 2 * 1024 * 1024 // Max file size in bytes (2 MB)
        }
      }
    },
    attach: {
      file: {
        dest: './modules/forums/client/attach/',
        temp: './modules/forums/client/attach/temp/',
        limits: {
          fileSize: 100 * 1024 * 1024 // Max file size in bytes (100 MB)
        }
      }
    },
    subtitle: {
      file: {
        dest: './modules/torrents/client/uploads/subtitles/',
        limits: {
          fileSize: 2 * 1024 * 1024 // Max file size in bytes (2 MB)
        }
      }
    }
  },
  shared: {
    owasp: {
      allowPassphrases: true,
      maxLength: 128,
      minLength: 10,
      minPhraseLength: 20,
      minOptionalTestsToPass: 4
    }
  }

};
