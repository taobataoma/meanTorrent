'use strict';

module.exports = {
  variable: {
    /**
     * site settings
     */
    site: {
      site_name: 'MEAN.im',
      site_namekey: 'MEAN',
      site_host: '127.0.0.1',
      site_port: 3000,
      site_domain: 'http://localhost',
      site_sessionSecret: 'mean.im.session.secret',

      site_admin_mail: 'admin@mean.im',
      site_webmaster_mail: 'webmaster@mean.im',

      site_title: 'meanTorrent',
      site_description: 'MEAN.JS BitTorrent - Full-Stack JavaScript Using MongoDB, Express, AngularJS, and Node.js, a Private/Public BitTorrent Tracker CMS with Multilingual and IRC announce support',
      site_keywords: 'mongodb, express, angularjs, node.js, mongoose, passport, torrent, bitTorrent, tracker, announce'
    },

    /**
     * mongodb settings
     */
    db: {
      db_host: 'localhost',
      db_name: 'mean-v2'
    },

    /**
     * meanTorrent load movie and tvserial info from TMDB[https://www.themoviedb.org/], please get a access key at there and config in here
     */
    tmdb: {
      key: 'this is access key from tmdb'
    },

    /**
     * meanTorrent need send mail to user when restore password, send invitations etc. before send these mail,
     * you need change the mail options at here, meanTorrent used module nodemailer, if you have any config question you can find at nodemailer.
     * nodemailer url: https://nodemailer.com/about/
     */
    mailer: {
      from: process.env.MAILER_FROM || 'admin@mean.im',
      options: {
        service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
        auth: {
          user: process.env.MAILER_EMAIL_ID || 'sample@gmail.com',
          pass: process.env.MAILER_PASSWORD || 'password'
        }
      }
    }
  }
};
