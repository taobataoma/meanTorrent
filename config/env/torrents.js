'use strict';

module.exports = {
  meanTorrentConfig: {
    /**
     * @app
     *
     * App & site settings
     *
     * @domain:                 site domain
     * @showDemoWarningPopup:   if is demo site, show warning popup whene home is opened for the first time.
     * @cronTimeZone:           timezone of cron
     * @showDebugLog:           if true, will console.log all debug info at server side and client side. when your site is prod env, please change this
     *                          value to false, then console.log info is not output
     */
    app: {
      name: 'CHD.im',
      domain: 'http://chd.im:3000',
      showDemoWarningPopup: true,
      cronTimeZone: 'Asia/Shanghai',
      showDebugLog: true
    },

    /**
     * @language
     *
     * Multilingual support settings
     *
     * @name:   language name
     * @index:  list index in menu
     * @class:  flag icon class, can find flag icon at '/public/lib/flag-icon-css/flags'
     * @title:  language title show in menu item
     *
     */
    language: [
      {name: 'en', index: 0, class: 'flag-icon-gb', title: 'English'},
      {name: 'zh', index: 1, class: 'flag-icon-cn', title: '中文'}
    ],

    /**
     * @announce
     *
     * tracker server announce settings
     *
     * @url:                    announce url, download client will request this url to report uploads and downloads data
     * @comment:                used in admin tools, auto replace torrent make group info with this setting
     * @announceInterval:       interval of twice announce request
     * @announcePrefix:         prefix of torrent file name, is will auto add when user download the torrent files
     * @admin:                  site admin mail address
     * @baseUrl:                torrent announce url base url, system will check it when user upload torrent file
     * @clientBlackListUrl:     forbidden download client list url, user can view this list to check forbidden client software
     * @privateTorrentCmsMode:  meanTorrent default tracker server mode is private (value true), the tracker server only accept private mode.
     *                          but, you can set this value to false to make a public torrent cms web site without tracker server and announce function.
     *                          if this value is false(public mode), server can scrape all torrent status from owner tracker server
     */
    announce: {
      url: 'http://chd.im:3000/announce',
      comment: 'meanTorrent group',
      announceInterval: 60 * 1000,
      announcePrefix: '{CHD.im}.',
      admin: 'admin@chd.im',
      baseUrl: 'http://chd.im:3000',
      clientBlackListUrl: 'http://chd.im:3000/client_black_list',
      privateTorrentCmsMode: true
    },

    /**
     * @scrapeTorrentsStatus
     *
     * This option used only when public cms mode (announce.privateTorrentCmsMode = false),
     * This defines the timing of scrape torrent status from other tracker server
     *
     * @scrapeInterval:     scrape interval with torrent last_scrape, Avoid frequent scrape, unit in hours
     * @onTorrentUpload:    scrape status at server side when the torrent uploaded by a user (= init the status info)
     * @onTorrentInHome:    scrape each torrent status at client side when load into home page (= update the status info)
     * @onTorrentInList:    scrape each torrent status at client side when load into torrent list page (= update the status info)
     *                      if too more items list in one page, this will make efficiency very low
     * @onTorrentInDetail:  scrape current torrent status at client side when load torrent detail info,
     *                      if onTorrentInHome and onTorrentInList is true, this value recommend to false
     */
    scrapeTorrentStatus: {
      scrapeInterval: 2,
      onTorrentUpload: true,
      onTorrentInHome: true,
      onTorrentInList: true,
      onTorrentInDetail: false
    },

    /**
     * @ircAnnounce
     *
     * IRC announce server settings
     *
     * @enable:             enable irc announce
     * @debug:              debug mode, more info will log out by console
     * @server:             IRC server address
     * @port:               IRC server port
     * @nick:               IRC announce user nick name, needed with IRC protocol
     * @userName:           IRC announce user username, needed with IRC protocol
     * @realName:           IRC announce user realName, needed with IRC protocol
     * @channel:            IRC announce channel name, the message will send to the appointed channel
     * @defaultMsgFormat:   the default announce message format
     * @tvserialMsgFormat:  the custom announce message format of tv serial type torrent
     * @showErrors:         log and show error info when some error happened
     * @autoRejoin:         auto rejoin into the channel when some event happened cause user part the announce channel
     * @autoConnect:        auto connect & reconnect to IRC server when disconnect from IRC server
     * @retryCount:         reconnect retry times
     * @retryDelay:         reconnect retry delay time, unit in millisecond
     * @encoding:           IRC announce message encoding, default to 'UTF-8'
     */
    ircAnnounce: {
      enable: true,
      debug: false,
      server: 'chd.im',
      port: 16667,
      nick: 'chdAnnounce',
      userName: 'meanTorrent',
      realName: 'IRC announce client',
      channel: '#chdAnnounce',
      defaultMsgFormat: '%s upload - torrent: %s, type: %s, size: %d, sale: %s, at %s',
      tvserialMsgFormat: '%s upload - torrent: %s, type: %s, size: %d, seasons: %d, episodes: %s, sale: %s, at %s',
      showErrors: true,
      autoRejoin: true,
      autoConnect: true,
      retryCount: 86400,
      retryDelay: 5000,
      encoding: 'UTF-8'
    },

    /**
     * @sign
     *
     * user register settings
     *
     * @openSignup:           set whether open the signup, if true, the user can signup(register) by heself,
     *                        if you create a private web site, and only accept invite to join, please set it to false.
     * @allowSocialSignin:    meanTorrent can accept social account to signin, like google, twitter, facebook etc.
     *                        if you do not want them to login, please set it to false
     * @showDemoSignMessage:  if true, will show demo sign in message in sign in page, if your site is not demo site, please set it to false
     */
    sign: {
      openSignup: true,
      allowSocialSignin: false,
      showDemoSignMessage: true
    },

    /**
     * @invite
     *
     * invite settings when sign.openSignup is false
     *
     * @openInvite:     if true, then any user can invite friends to join us, if false, only admin/oper can send invite mail
     * @scoreExchange:  if any user can send invite mail, the user must used score number to exchange an invite send qualifications, if the user has no
     *                  enough score, then can not send invite mail too.
     * @expires:        if user exchange an invite send qualifications, then must send it out within the expiration time
     *                  if user received an invite mail, must signin(register) within the expiration time
     *                  if exceed the expiration time, the invite send qualifications will invalid and user also can not signin(register).
     */
    invite: {
      openInvite: true,
      scoreExchange: 10000,
      expires: 60 * 60 * 1000 * 24
    },
    score: {
      levelStep: 500,
      action: {
        signEveryday: {name: 'signEveryday', value: 10, enable: true},
        uploadTorrent: {name: 'uploadTorrent', value: 50, enable: true},
        uploadTorrentBeDeleted: {name: 'uploadTorrentBeDeleted', value: -50, enable: true},
        uploadTorrentBeRecommend: {name: 'uploadTorrentBeRecommend', value: 10, enable: true},
        uploadSubtitle: {name: 'uploadSubtitle', value: 20, enable: true},
        uploadSubtitleBeDeleted: {name: 'uploadSubtitleBeDeleted', value: -20, enable: true},

        seedAnnounce: {
          name: 'seedAnnounce',
          additionSize: 1024 * 1024 * 1024 * 10,  //10G
          perlSize: 1024 * 1024 * 1024,   //1G
          value: 5,
          enable: true
        }
      },
      thumbsUpScore: {
        torrent: 10,
        topic: 10
      }
    },
    messages: {
      type: {
        name: 'TYPE',
        value: [
          {name: 'USER', value: 'user'},
          {name: 'SYSTEM', value: 'system'},
          {name: 'ADVERT', value: 'advert'},
          {name: 'NOTICE', value: 'notice'}
        ]
      }
    },
    trace: {
      action: {
        AdminUpdateUserRole: {name: 'AdminUpdateUserRole', enable: true},
        AdminUpdateUserStatus: {name: 'AdminUpdateUserStatus', enable: true},
        AdminUpdateUserScore: {name: 'AdminUpdateUserScore', enable: true},
        AdminUpdateUserUploaded: {name: 'AdminUpdateUserUploaded', enable: true},
        AdminUpdateUserDownloaded: {name: 'AdminUpdateUserDownloaded', enable: true},
        AdminUserDelete: {name: 'AdminUserDelete', enable: true},
        AdminUserEdit: {name: 'AdminUserEdit', enable: true},
        userPasswordReset: {name: 'userPasswordReset', enable: true},
        userSignUp: {name: 'userSignUp', enable: true},

        AdminTorrentDelete: {name: 'AdminTorrentDelete', enable: true},
        AdminTorrentSetSaleType: {name: 'AdminTorrentSetSaleType', enable: true},
        AdminTorrentSetRecommendLevel: {name: 'AdminTorrentSetRecommendLevel', enable: true},
        AdminTorrentSetReviewedStatus: {name: 'AdminTorrentSetReviewedStatus', enable: true},

        userInvitationExchange: {name: 'userInvitationExchange', enable: true},
        adminRemoveHnrWarning: {name: 'adminRemoveHnrWarning', enable: true},
        userRemoveHnrWarning: {name: 'userRemoveHnrWarning', enable: true},
        userSendInvitation: {name: 'userSendInvitation', enable: true},
        adminSendOfficialInvitation: {name: 'adminSendOfficialInvitation', enable: true},

        userAnnounceData: {name: 'userAnnounceData', enable: true},
        userScoreChange: {name: 'userScoreChange', enable: true},

        forumDeleteTopic: {name: 'forumDeleteTopic', enable: true},
        forumDeleteReply: {name: 'forumDeleteReply', enable: true}
      }
    },

    /**
     * @torrentType
     *
     * torrent type settings
     * if you need more torrent type, please add at here and config it, the system will add new type everywhere automatic
     *
     * @name:   TYPE, do not change it
     * @value:  configure settings value of torrent type
     *
     *        @name:      name of type, used by $translate at TORRENT_TYPE_LABEL, will show translate result as torrent tag in torrent list
     *        @value:     value of type, torrent type value in model, will write this value into mongodb and query torrents by this value
     *        @title:     title of type, used by $translate at MENU_TORRENTS_SUB, will show translate result in header submenu item
     *        @state:     angular state of type, this state value used in module route config
     *        @url:       window location url of type
     *        @divider:   divider status of submenu item
     *        @position:  position of submenu item(ordered index)
     *
     * if you add a config json item, please add translate string:
     *        MENU_TORRENTS_SUB
     *        TORRENT_TYPE_LABEL
     */
    torrentType: {
      name: 'TYPE',
      value: [
        {
          enable: true,
          name: 'MOVIE',
          value: 'movie',
          title: 'MENU_TORRENTS_SUB.MOVIE',
          state: 'torrents.movie',
          url: '/movie',
          divider: false,
          position: 1
        },
        {
          enable: true,
          name: 'TVSERIAL',
          value: 'tvserial',
          title: 'MENU_TORRENTS_SUB.TVSERIAL',
          state: 'torrents.tvserial',
          url: '/tv',
          divider: false,
          position: 2
        },
        {
          enable: true,
          name: 'MUSIC',
          value: 'music',
          title: 'MENU_TORRENTS_SUB.MUSIC',
          state: 'torrents.music',
          url: '/music',
          divider: false,
          position: 3
        },
        {
          enable: true,
          name: 'VARIETY',
          value: 'variety',
          title: 'MENU_TORRENTS_SUB.VARIETY',
          state: 'torrents.variety',
          url: '/variety',
          divider: false,
          position: 4
        },
        {
          enable: true,
          name: 'SOFTWARE',
          value: 'software',
          title: 'MENU_TORRENTS_SUB.SOFTWARE',
          state: 'torrents.software',
          url: '/software',
          divider: true,
          position: 4
        },
        {
          enable: true,
          name: 'EBOOK',
          value: 'ebook',
          title: 'MENU_TORRENTS_SUB.EBOOK',
          state: 'torrents.ebook',
          url: '/ebook',
          divider: false,
          position: 4
        },
        {
          enable: true,
          name: 'OTHER',
          value: 'other',
          title: 'MENU_TORRENTS_SUB.OTHER',
          state: 'torrents.other',
          url: '/other',
          divider: true,
          position: 5
        }
      ]
    },

    /**
     * @torrentStatus
     *
     * the torrent status settings
     *
     * @name:   do not change it
     * @value:  value of status
     *
     *        @name:  name of status level, used by $translate at TORRENT_RECOMMEND_LEVEL_ITEM, will show translate result in torrent admin list
     *        @value: value of status level, will write this value into mongodb and query(search) torrents by this value
     */
    torrentStatus: {
      name: 'STATUS',
      value: [
        {name: 'NEW', value: 'new'},
        {name: 'REVIEWED', value: 'reviewed'},
        {name: 'DELETED', value: 'deleted'}
      ]
    },

    /**
     * @torrentRecommendLevel
     *
     * the torrent recommend level settings
     *
     * @name:   do not change it
     * @value:  value of recommend level
     *
     *        @name:  name of recommend level, used by $translate at TORRENT_RECOMMEND_LEVEL_ITEM, will show translate result as torrent tag in torrent list
     *        @value: value of recommend level, will write this value into mongodb and query(search) torrents by this value
     */
    torrentRecommendLevel: {
      name: 'RECOMMENDLEVEL',
      value: [
        {name: 'LEVEL0', value: 'none'},
        {name: 'LEVEL1', value: 'level1'},
        {name: 'LEVEL2', value: 'level2'},
        {name: 'LEVEL3', value: 'level3'}
      ]
    },

    /**
     * @hitAndRun
     *
     * settings of Hit & Run system, system will auto update the warning status and number of user when client announce to tracker server
     * when admin/oper changed the torrent h&r prop to false, system will auto remove all warning and number of user
     * when admin/oper to delete a h&r torrent, system will auto remove all warning and number of user
     *
     * @condition:                          the condition of HnR warning, user must meet one of them before you receive the warning
     *        @seedTime:                  torrent seed time, unit of day, default to 7 days
     *        @ratio:                     seed ratio, default to 1.5
     * @forbiddenDownloadMinWarningNumber:  when user get this number of warning, then can not to download any torrents, but can continue download the warning status torrent
     * @scoreToRemoveWarning:               if user has any warning, user can remove one warning by score number, if the user has not enough score, user still can remove these
     *                                      warning by donate the VIP class.
     */
    hitAndRun: {
      condition: {
        seedTime: 24 * 60 * 60 * 1000 * 7,
        ratio: 1.5
      },
      forbiddenDownloadMinWarningNumber: 3,
      scoreToRemoveWarning: 10000
    },

    userStatus: {
      name: 'STATUS',
      value: [
        {name: 'NORMAL', value: 'normal'},
        {name: 'BANNED', value: 'banned'},
        {name: 'SEALED', value: 'sealed'}
      ]
    },
    userRoles: ['user', 'oper', 'admin'],
    clientBlackList: [
      {name: 'Transmission/2.93'},
      {name: 'Mozilla'},
      {name: 'AppleWebKit'},
      {name: 'Safari'},
      {name: 'Chrome'},
      {name: 'Lynx'},
      {name: 'Opera'}
    ],
    torrentSalesType: {
      name: 'SALESTYPE',
      value: [
        {name: 'U1/FREE', desc: 'Upload * 1, Download Free'},
        {name: 'U1/D.3', desc: 'Upload * 1, Download * 0.3'},
        {name: 'U1/D.5', desc: 'Upload * 1, Download * 0.5'},
        {name: 'U1/D.8', desc: 'Upload * 1, Download * 0.8'},
        {name: 'U1/D1', desc: 'Upload * 1, Download * 1'},
        {name: 'U2/FREE', desc: 'Upload * 2, Download Free'},
        {name: 'U2/D.3', desc: 'Upload * 2, Download * 0.3'},
        {name: 'U2/D.5', desc: 'Upload * 2, Download * 0.5'},
        {name: 'U2/D.8', desc: 'Upload * 2, Download * 0.8'},
        {name: 'U2/D1', desc: 'Upload * 2, Download * 1'},
        {name: 'U3/FREE', desc: 'Upload * 3, Download Free'},
        {name: 'U3/D.3', desc: 'Upload * 3, Download * 0.3'},
        {name: 'U3/D.5', desc: 'Upload * 3, Download * 0.5'},
        {name: 'U3/D.8', desc: 'Upload * 3, Download * 0.8'},
        {name: 'U3/D1', desc: 'Upload * 3, Download * 1'}
      ],
      expires: {size: 1024 * 1024 * 1024, time: 60 * 60 * 1000}
    },
    torrentSalesValue: {
      global: undefined,
      vip: {
        Ur: 1.25,
        Dr: 0
      }
    },
    chat: {
      ban: {
        expires: 60 * 60 * 1000 * 1
      }
    },
    tmdbConfig: {
      tmdbHome: 'https://www.themoviedb.org',
      tmdbMovieLinkUrl: 'https://www.themoviedb.org/movie/',
      tmdbTvserialLinkUrl: 'https://www.themoviedb.org/tv/',
      //please change it to your api key from themoviedb.org
      key: '7888f0042a366f63289ff571b68b7ce0',
      backdropImgBaseUrl: 'http://image.tmdb.org/t/p/w1280',
      backdropImgBaseUrl_300: 'http://image.tmdb.org/t/p/w300',
      posterImgBaseUrl: 'http://image.tmdb.org/t/p/w500',
      posterListBaseUrl: 'http://image.tmdb.org/t/p/w92',
      castImgBaseUrl: 'http://image.tmdb.org/t/p/w132_and_h132_bestv2'
    },
    imdbConfig: {
      imdbLinkUrl: 'http://www.imdb.com/title/'
    },
    forumsConfig: {
      category: [
        {name: 'AFFAIRS', value: 'affairs', index: 0},
        {name: 'DISCUSS', value: 'discuss', index: 1},
        {name: 'BUSINESS', value: 'business', index: 2}
      ],
      showThumbsUpUserList: true
    },
    itemsPerPage: {
      topicsPerPage: 10,
      repliesPerPage: 10,
      topicsSearchPerPage: 10,
      torrentsPerPage: 15,
      torrentsCommentsPerPage: 10,
      tracesPerPage: 30
    },
    resourcesTags: {
      radio: [
        {
          name: 'MUSIC_SUB_CAT',
          cats: ['music'],
          value: [
            {name: 'CD', icon: ''},
            {name: 'MTV', icon: ''}
          ]
        },
        {
          name: 'TYPE',
          cats: ['movie', 'tvserial'],
          value: [
            {name: 'BLU_RAY', icon: ''},
            {name: 'REMUX', icon: ''},
            {name: 'WEB_DL', icon: ''},
            {name: 'ENCODE', icon: ''}
          ]
        },
        {
          name: 'RESOLUTION',
          cats: ['movie', 'tvserial', 'music', 'variety'],
          value: [
            {name: 'S4K', icon: ''},
            {name: 'S1080P', icon: ''},
            {name: 'S1080I', icon: ''},
            {name: 'S720P', icon: ''}
          ]
        },
        {
          name: 'VIDEO',
          cats: ['movie', 'tvserial', 'music', 'variety'],
          value: [
            {name: 'AVC', icon: ''},
            {name: 'X265', icon: ''},
            {name: 'X264', icon: ''}
          ]
        },
        {
          name: 'AUDIO',
          cats: ['movie', 'tvserial', 'music', 'variety'],
          value: [
            {name: 'AAC', icon: ''},
            {name: 'AC3', icon: ''},
            {name: 'LPCM', icon: ''},
            {name: 'DTS', icon: ''},
            {name: 'DTS_HD', icon: ''},
            {name: 'ATMOS_TRUEHD', icon: ''}
          ]
        },
        {
          name: 'CHANNEL',
          cats: ['movie', 'tvserial', 'music', 'variety'],
          value: [
            {name: 'C20', icon: ''},
            {name: 'C51', icon: ''},
            {name: 'C71', icon: ''}
          ]
        },
        {
          name: 'THREED',
          cats: ['movie'],
          value: [
            {name: 'T3D', icon: ''},
            {name: 'T2D', icon: ''},
            {name: 'T2D_3D', icon: ''}
          ]
        },
        {
          name: 'REGION',
          cats: ['movie', 'tvserial', 'music', 'variety'],
          value: [
            {name: 'USA', icon: ''},
            {name: 'CHINA', icon: ''},
            {name: 'JAPAN', icon: ''},
            {name: 'KOREA', icon: ''},
            {name: 'INDIA', icon: ''},
            {name: 'ARAB', icon: ''}
          ]
        },
        {
          name: 'PLATFORM',
          cats: ['software'],
          value: [
            {name: 'Windows', icon: ''},
            {name: 'MacOS', icon: ''},
            {name: 'Linux', icon: ''},
            {name: 'iOS', icon: ''},
            {name: 'Android', icon: ''}
          ]
        }
      ],
      checkbox: [
        {
          name: 'MODIFY',
          cats: ['movie', 'tvserial', 'variety'],
          value: [
            {name: 'DIY', icon: ''},
            {name: 'GUOPEI', icon: ''},
            {name: 'ZHONGZI', icon: ''}
          ]
        },
        {
          name: 'RANKING',
          cats: ['movie', 'tvserial'],
          value: [
            {name: 'IMDB_TOP100', icon: ''},
            {name: 'IMDB_TOP250', icon: ''},
            {name: 'DOUBAN_TOP100', icon: ''},
            {name: 'DOUBAN_TOP250', icon: ''}
          ]
        }
      ]
    }
  }
};
