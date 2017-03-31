'use strict';

module.exports = {
  //announce config
  announce: {
    url: 'http://localhost:3000/announce',
    admin: 'admin@imean.io'
  },
  resourcesTags: {
    movie: {
      type: [
        {name: 'Blu-ray', icon: ''},
        {name: 'REMUX', icon: ''},
        {name: 'Encode', icon: ''}
      ],
      size: [
        {name: '4K', icon: ''},
        {name: '1080p', icon: ''},
        {name: '720p', icon: ''}
      ],
      video: [
        {name: 'AVC', icon: ''},
        {name: 'x265', icon: ''},
        {name: 'x264', icon: ''}
      ],
      audio: [
        {name: 'AAC', icon: ''},
        {name: 'DTS', icon: ''},
        {name: 'DTS-HD', icon: ''},
        {name: 'Atmos-TrueHD', icon: ''}
      ],
      threed: [
        {name: '3D', icon: ''},
        {name: '2D', icon: ''},
        {name: '2D-3D', icon: ''}
      ],
      top: [
        {name: 'IMDB-top100', icon: ''},
        {name: 'IMDB-top250', icon: ''},
        {name: 'DOUBAN-top100', icon: ''},
        {name: 'DOUBAN-top250', icon: ''}
      ],
      region: [
        {name: 'china', icon: ''},
        {name: 'Japan', icon: ''},
        {name: 'Korea', icon: ''},
        {name: 'India', icon: ''},
        {name: 'Arab', icon: ''}
      ],
      modify: [
        {name: 'DIY', icon: ''},
        {name: 'GUOYU', icon: ''},
        {name: 'ZHONGZI', icon: ''}
      ]
    },
    mtv: {},
    music: {}
  }
};
