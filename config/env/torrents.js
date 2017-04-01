'use strict';

module.exports = {
  //announce config
  announce: {
    url: 'http://localhost:3000/announce',
    admin: 'admin@imean.io'
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
        },
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
};
