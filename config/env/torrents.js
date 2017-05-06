'use strict';

module.exports = {
  meanTorrentConfig: {
    language: [
      {name: 'en', css: '.flag-icon-gb'},
      {name: 'zh', css: '.flag-icon-cn'}
    ],
    announce: {
      url: 'http://127.0.0.1:3000/announce',
      announce_prefix: '[CHD.im].',
      admin: 'admin@chd.im',
      base_url: 'http://www.chd.im',
      client_black_list_url: 'http://www.chd.im/client_black_list',
      open_tracker: true
    },
    torrentType: {
      name: 'TYPE',
      value: [
        {name: 'MOVIE', value: 'movie'},
        {name: 'MTV', value: 'MTV'},
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
    tmdbConfig: {
      tmdb_link_url: 'https://www.themoviedb.org/movie/',
      //please change it to your api key from themoviedb.org
      key: '7888f0042a366f63289ff571b68b7ce0',
      backdrop_img_base_url: 'http://image.tmdb.org/t/p/w1280',
      poster_img_base_url: 'http://image.tmdb.org/t/p/w500',
      poster_list_base_url: 'http://image.tmdb.org/t/p/w92',
      cast_img_base_url: 'http://image.tmdb.org/t/p/w132_and_h132_bestv2'
    },
    imdbConfig: {
      imdb_link_url: 'http://www.imdb.com/title/'
    },
    resourcesTags: {
      movie: {
        radio: [
          {
            name: 'TYPE',
            value: [
              {name: 'BLU_RAY', icon: ''},
              {name: 'REMUX', icon: ''},
              {name: 'ENCODE', icon: ''}
            ]
          },
          {
            name: 'RESOLUTION',
            value: [
              {name: 'S4K', icon: ''},
              {name: 'S1080P', icon: ''},
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
              {name: 'DTS', icon: ''},
              {name: 'DTS_HD', icon: ''},
              {name: 'ATMOS_TRUEHD', icon: ''}
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
            name: 'RANKING',
            value: [
              {name: 'IMDB_TOP100', icon: ''},
              {name: 'IMDB_TOP250', icon: ''},
              {name: 'DOUBAN_TOP100', icon: ''},
              {name: 'DOUBAN_TOP250', icon: ''}
            ]
          },
          {
            name: 'MODIFY',
            value: [
              {name: 'DIY', icon: ''},
              {name: 'GUOPEI', icon: ''},
              {name: 'ZHONGZI', icon: ''}
            ]
          }
        ]
      }
    }
  }
};
