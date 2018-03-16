'use strict';

module.exports = {
  variable: {
    /**
     * site settings
     */
    site: {
      site_name: 'MINE.pt',
      site_namekey: 'MINE',
      site_host: 'mine.pt',
      site_port: 3000,
      site_domain: 'https://mine.pt',
      site_sessionSecret: 'mine.pt.session.secret',

      site_admin_mail: 'meetuspt@gmail.com',
      site_webmaster_mail: 'webmaster@mine.pt',

      site_title: 'mine.pt',
      site_description: 'meanTorrent - a Private BitTorrent Tracker site, include movie, tvserial, music, game, sports, software, ebook etc.',
      site_keywords: 'BitTorrent, tracker, movie, tvserial, music, game, sports, software, ebook'
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
      key: '7888f0042a366f63289ff571b68b7ce0'
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
          user: process.env.MAILER_EMAIL_ID || 'meetuspt@gmail.com',
          pass: process.env.MAILER_PASSWORD || 'meetus740729'
        }
      }
    }
  }
};
