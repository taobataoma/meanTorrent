'use strict';

module.exports = {
  meanTorrentConfig: {
    app: {
      domain: 'http://chd.im:3000',
      show_warning_popup: true
    },
    language: [
      {name: 'en', index: 0, class: 'flag-icon-gb', title: 'English'},
      {name: 'zh', index: 1, class: 'flag-icon-cn', title: '中文'}
    ],
    announce: {
      url: 'http://chd.im:3000/announce',
      comment: 'meanTorrent group',
      announce_interval: 60 * 1000,
      announce_prefix: '[CHD.im].',
      admin: 'admin@chd.im',
      base_url: 'http://chd.im:3000',
      client_black_list_url: 'http://chd.im:3000/client_black_list',
      private_torrent_cms: true
    },
    sign: {
      open_signin: true,
      allow_social_sign: false
    },
    invite: {
      open_invite: true,
      score_exchange: 10000,
      expires: 60 * 60 * 1000 * 24
    },
    score: {
      level_step: 500,
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

        userAnnounceData: {name: 'userAnnounceData', enable: true},
        userScoreChange: {name: 'userScoreChange', enable: true},

        forumDeleteTopic: {name: 'forumDeleteTopic', enable: true},
        forumDeleteReply: {name: 'forumDeleteReply', enable: true}
      }
    },
    torrentType: {
      name: 'TYPE',
      value: [
        {name: 'MOVIE', value: 'movie'},
        {name: 'TVSERIAL', value: 'tvserial'},
        {name: 'MUSIC', value: 'music'},
        {name: 'OTHER', value: 'other'}
      ]
    },
    torrentStatus: {
      name: 'STATUS',
      value: [
        {name: 'NEW', value: 'new'},
        {name: 'REVIEWED', value: 'reviewed'},
        {name: 'DELETED', value: 'deleted'}
      ]
    },
    torrentRecommendLevel: {
      name: 'RECOMMENDLEVEL',
      value: [
        {name: 'LEVEL0', value: 'none'},
        {name: 'LEVEL1', value: 'level1'},
        {name: 'LEVEL2', value: 'level2'},
        {name: 'LEVEL3', value: 'level3'}
      ]
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
      {name: 'Chrome'}
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
      tmdb_home: 'https://www.themoviedb.org',
      tmdb_movie_link_url: 'https://www.themoviedb.org/movie/',
      tmdb_tv_link_url: 'https://www.themoviedb.org/tv/',
      //please change it to your api key from themoviedb.org
      key: '7888f0042a366f63289ff571b68b7ce0',
      backdrop_img_base_url: 'http://image.tmdb.org/t/p/w1280',
      backdrop_img_base_url_300: 'http://image.tmdb.org/t/p/w300',
      poster_img_base_url: 'http://image.tmdb.org/t/p/w500',
      poster_list_base_url: 'http://image.tmdb.org/t/p/w92',
      cast_img_base_url: 'http://image.tmdb.org/t/p/w132_and_h132_bestv2'
    },
    imdbConfig: {
      imdb_link_url: 'http://www.imdb.com/title/'
    },
    forumsConfig: {
      category: [
        {name: 'AFFAIRS', value: 'affairs'},
        {name: 'DISCUSS', value: 'discuss'},
        {name: 'BUSINESS', value: 'business'}
      ],
      thumbs_up_score: 10
    },
    itemsPerPage: {
      topics_per_page: 10,
      torrents_per_page: 15,
      torrents_comments_per_page: 10
    },
    resourcesTags: {
      movie: {
        radio: [
          {
            name: 'TYPE',
            value: [
              {name: 'BLU_RAY', icon: ''},
              {name: 'REMUX', icon: ''},
              {name: 'WEB_DL', icon: ''},
              {name: 'ENCODE', icon: ''}
            ]
          },
          {
            name: 'RESOLUTION',
            value: [
              {name: 'S4K', icon: ''},
              {name: 'S1080P', icon: ''},
              {name: 'S1080I', icon: ''},
              {name: 'S720P', icon: ''}
            ]
          },
          {
            name: 'VIDEO',
            value: [
              {name: 'AVC', icon: ''},
              {name: 'X265', icon: ''},
              {name: 'X264', icon: ''}
            ]
          },
          {
            name: 'AUDIO',
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
            value: [
              {name: 'C20', icon: ''},
              {name: 'C51', icon: ''},
              {name: 'C71', icon: ''}
            ]
          },
          {
            name: 'THREED',
            value: [
              {name: 'T3D', icon: ''},
              {name: 'T2D', icon: ''},
              {name: 'T2D_3D', icon: ''}
            ]
          },
          {
            name: 'REGION',
            value: [
              {name: 'CHINA', icon: ''},
              {name: 'JAPAN', icon: ''},
              {name: 'KOREA', icon: ''},
              {name: 'INDIA', icon: ''},
              {name: 'ARAB', icon: ''}
            ]
          }
        ],
        checkbox: [
          {
            name: 'MODIFY',
            value: [
              {name: 'DIY', icon: ''},
              {name: 'GUOPEI', icon: ''},
              {name: 'ZHONGZI', icon: ''}
            ]
          },
          {
            name: 'RANKING',
            value: [
              {name: 'IMDB_TOP100', icon: ''},
              {name: 'IMDB_TOP250', icon: ''},
              {name: 'DOUBAN_TOP100', icon: ''},
              {name: 'DOUBAN_TOP250', icon: ''}
            ]
          }
        ]
      },
      tv: {
        radio: [
          {
            name: 'TYPE',
            value: [
              {name: 'BLU_RAY', icon: ''},
              {name: 'REMUX', icon: ''},
              {name: 'WEB_DL', icon: ''},
              {name: 'ENCODE', icon: ''}
            ]
          },
          {
            name: 'RESOLUTION',
            value: [
              {name: 'S4K', icon: ''},
              {name: 'S1080P', icon: ''},
              {name: 'S1080I', icon: ''},
              {name: 'S720P', icon: ''}
            ]
          },
          {
            name: 'VIDEO',
            value: [
              {name: 'AVC', icon: ''},
              {name: 'X265', icon: ''},
              {name: 'X264', icon: ''}
            ]
          },
          {
            name: 'AUDIO',
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
            value: [
              {name: 'C20', icon: ''},
              {name: 'C51', icon: ''},
              {name: 'C71', icon: ''}
            ]
          },
          {
            name: 'REGION',
            value: [
              {name: 'USA', icon: ''},
              {name: 'CHINA', icon: ''},
              {name: 'JAPAN', icon: ''},
              {name: 'KOREA', icon: ''},
              {name: 'INDIA', icon: ''},
              {name: 'ARAB', icon: ''}
            ]
          }
        ],
        checkbox: [
          {
            name: 'MODIFY',
            value: [
              {name: 'DIY', icon: ''},
              {name: 'GUOPEI', icon: ''},
              {name: 'ZHONGZI', icon: ''}
            ]
          },
          {
            name: 'RANKING',
            value: [
              {name: 'IMDB_TOP100', icon: ''},
              {name: 'IMDB_TOP250', icon: ''},
              {name: 'DOUBAN_TOP100', icon: ''},
              {name: 'DOUBAN_TOP250', icon: ''}
            ]
          }
        ]
      },
      music: {},
      other: {}
    }
  }
};
