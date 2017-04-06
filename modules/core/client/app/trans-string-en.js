(function (app) {
  'use strict';

  // Setting HTML5 Location Mode
  angular
    .module(app.applicationModuleName)
    .config(transConfig);

  // **************************************************
  // English Strings
  // --------------------------------------------------
  // Don`t change other code
  // **************************************************

  var stringen = {
    COMINGSOON: 'coming soon...',

    //client topbar menu
    MENU_CHAT: 'Chat',
    MENU_TORRENTS: 'Torrents',
    MENU_TORRENTS_ADMIN: 'Manage Torrents',
    MENU_UPLOADS: 'Uploads',
    MENU_FORUMS: 'Forums',
    MENU_RANKING: 'Ranking',
    MENU_RULES: 'Rules',
    MENU_VIP: 'VIP',
    MENU_ADMIN: 'Admin',

    //sub menu of torrents
    MENU_TORRENTS_SUB: {
      SUB_MOVIE: 'Movie',
      SUB_MTV: 'MTV',
      SUB_MUSIC: 'Music',
      SUB_OTHER: 'Other'
    },

    //client menu
    SIGNOUT: 'Signout',
    SIGNIN: 'Sign In',
    SIGNUP: 'Sign Up',
    EDIT_PROFILE: 'Edit Profile',
    EDIT_PROFILE_PIC: 'Edit Profile Picture',
    CHANGE_PASSWORD: 'Change Password',
    MANAGE_SOCIAL_ACCOUNTS: 'Manage Social Accounts',

    //Uploads rules
    UPLOADS_RULES: 'Uploads Rules:',
    UPLOADS_RULES_COUNT: '6',
    UPLOADS_RULES_CONTENT: [
      'The torrent file`s Tracker URL must be: <mark><strong>{{url}}</strong></mark>.',
      'The torrent file`s TMDB_ID must be TheMovieDB resources ID, <strong><a href="https://www.themoviedb.org/" target="_blank">you can find the ID from here</a></strong>.',
      'The resources detail info can be autoload, if it`s fine, then you can submit it.',
      'Select one or more tags that match the resources, which will play a significant role in your search results.',
      'After the submission of documents, may be approved by the management, the rules do not meet the seeds will be deleted directly.',
      'For additional assistance, please contact our administrator: <strong><a href="mailto:#">{{admin}}</a></strong>.'
    ],

    //HomeController & home views
    LOADING_TOP: 'Loading recommended info, please waiting...',
    TOP_MOVIE_INFO_ERROR: 'Get movie top info faild',

    //element title/alt
    TITLE_ALT: {
      SEEDS: 'Seeds users',
      LEECHERS: 'Leechers users',
      FINISHED: 'Finished users',
      IMDB_VOTES: 'IMDB Votes'
    },

    //table fields
    TABLE_FIELDS: {
      INFO: 'Torrent info',
      SIZE: 'Size',
      SEEDS_LEECHERS_FINISHED: 'S/L/F',
      PUBLISHER: 'Publisher',
      LIFETIME: 'Life',
      VOTES: 'Votes'
    },

    //TorrentsController & views
    MOVIE_PAGE_INFO_ERROR: 'Get movie page info faild',
    TAGS_SEARCH: 'Movie - Tags Search',
    CA_KEYWORD: 'Keyword',
    PH_KEYWORD: 'Search keyword',

    //TorrentsUploadsController & views
    TORRENTS_UPLOAD_SUCCESSFULLY: 'Successfully uploads file',
    TORRENTS_UPLOAD_FAILED: 'Failed to uploads file',
    TORRENTS_NO_FILE_SELECTED: 'No file selected',

    SELECT_TORRENT_FILE: 'Please select the torrent file',
    SELECT_FILE: 'Select file',
    DO_UPLOADS: 'Uploads',
    ENTER_TMDB_ID: 'Please enter theMovieDB id 　<span style="font-size: 10pt;">[<a href="https://www.themoviedb.org/" target="_blank">find id on themofiedb.org</a>]</span>',
    LOAD_TMDB_INFO: 'Load info',
    TMDB_ID: 'TMDB ID',
    TMDB_ID_OK: 'MDB ID is ok! Get info successfully',
    TMDB_ID_ERROR: 'MDB ID is error! Get info failed',
    TMDB_ID_REQUIRED: 'Please enter TMDB ID',
    TMDB_MOVIE_INFO: 'The movie info from TMDB',
    TMDB_IS_LOADING: 'Loading the movie info, please wait...',
    SELECT_TAGS: 'Please select any tags for the resources',
    TORRENTS_SUBMIT_UPLOADS: 'Agree the rules and submit your resources',
    SUBMIT_BUTTON: 'OK, SUBMIT NOW',
    CANCEL_BUTTON: 'NO, CANCEL IT',
    AGREE_RULES: 'I agree and already read all the rules, <a href="#">read here</a>',
    DOWNLOAD_TORRENT: 'Download Torrent',

    //footer view
    MIT_PROTOCOL: 'The source of this project is protected by <a href="https://github.com/twbs/bootstrap/blob/master/LICENSE" target="_blank">MIT</a> open source protocol',
    GIT_REPO: 'Power by &copy;meanTottent，<a href="https://github.com/taobataoma/meanTorrent" target="_blank">view on GitHub</a>',

    ///////////////////////the movie db fields////////////////////////////////
    TMDB_FIELDS: {
      ID: 'id',
      IMDB_ID: 'imdb_id',
      IMDB_LINK: 'IMDB Link',
      TMDB_LINK: 'TMDB Link',
      HOMEPAGE: 'homepage',
      ADULT: 'adult',
      BUDGET: 'budget',
      REVENUE: 'revenue',
      ORIGINAL_LANGUAGE: 'original_language',
      ORIGINAL_TITLE: 'original_title',
      TITLE: 'title',
      BELONGS_TO_COLLECTION: 'belongs_to_collection',
      GENRES: 'genres',
      OVERVIEW: 'overview',
      POPULARITY: 'popularity',
      PRODUCTION_COMPANIES: 'production_companies',
      PRODUCTION_COUNTRIES: 'production_countries',
      RELEASE_DATE: 'release_date',
      RUNTIME: 'runtime',
      SPOKEN_LANGUAGES: 'spoken_languages',
      STATUS: 'status',
      TAGLINE: 'tagline',
      VIDEO: 'video',
      VOTE_AVERAGE: 'vote_average',
      VOTE_COUNT: 'vote_count',
      VOTE_UNIT: 'users',
      BACKDROP_PATH: 'backdrop_path',
      POSTER_PATH: 'poster_path',
      CAST: 'cast:'
    },

    /////////////////////////resources tag fields///////////////////////////////////
    RESOURCESTAGS: {
      TYPE: {
        SELF: 'Type',
        BLU_RAY: 'BLU_RAY',
        REMUX: 'REMUX',
        ENCODE: 'ENCODE'
      },

      RESOLUTION: {
        SELF: 'Resolution',
        S4K: '4K',
        S1080P: '1080P',
        S720P: '720P'
      },

      VIDEO: {
        SELF: 'Video Codec',
        AVC: 'AVC',
        X265: 'X265',
        X264: 'X264'
      },

      AUDIO: {
        SELF: 'Audio Codec',
        AAC: 'AAC',
        DTS: 'DTS',
        DTS_HD: 'DTS HD',
        ATMOS_TRUEHD: 'Atmos TrueHD'
      },

      THREED: {
        SELF: '2D/3D',
        T2D: '2D',
        T3D: '3D',
        T2D_3D: '2D-3D'
      },

      RANKING: {
        SELF: 'Ranking',
        IMDB_TOP100: 'IMDB TOP100',
        IMDB_TOP250: 'IMDB TOP250',
        DOUBAN_TOP100: 'Douban TOP100',
        DOUBAN_TOP250: 'Douban TOP250'
      },

      REGION: {
        SELF: 'Region',
        CHINA: 'China',
        JAPAN: 'Japan',
        KOREA: 'Korea',
        INDIA: 'India',
        ARAB: 'Arab'
      },

      MODIFY: {
        SELF: 'Modify',
        DIY: 'DIY',
        GUOPEI: 'Mandarin',
        ZHONGZI: 'Chinese Subtitle'
      }
    }
  };

  // **************************************************
  // English Strings end
  // **************************************************

  // config $translateProvider
  transConfig.$inject = ['$translateProvider'];
  function transConfig($translateProvider) {
    $translateProvider.translations('en', stringen);
  }

}(ApplicationConfiguration));
