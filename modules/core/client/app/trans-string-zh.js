(function (app) {
  'use strict';

  // Setting HTML5 Location Mode
  angular
    .module(app.applicationModuleName)
    .config(transConfig);

  // **************************************************
  // 中 文 翻 译
  // --------------------------------------------------
  // 请不要修改翻译部分之外的代码
  // **************************************************

  var string_zh = {
    COMINGSOON: '开发中，请稍候...',

    //client topbar menu
    MENU_CHAT: '聊天室',
    MENU_TORRENTS: '种子',
    MENU_TORRENTS_ADMIN: '种子管理',
    MENU_USERS_ADMIN: '用户管理',
    MENU_UPLOAD: '发布',
    MENU_FORUMS: '论坛',
    MENU_RANKING: '排行榜',
    MENU_RULES: '规则',
    MENU_VIP: 'VIP',
    MENU_ADMIN: '管理中心',

    //sub menu of torrents
    MENU_TORRENTS_SUB: {
      SUB_MOVIE: '电影',
      SUB_MTV: 'MTV',
      SUB_MUSIC: '音乐',
      SUB_OTHER: '其它'
    },

    //client account menu
    SIGNOUT: '退出登录',
    SIGNIN: '登录',
    SIGNUP: '注册',
    EDIT_PROFILE: '修改个人信息',
    EDIT_PROFILE_PIC: '修改个人头像',
    CHANGE_PASSWORD: '修改登录密码',
    MANAGE_SOCIAL_ACCOUNTS: '管理社交帐号',

    //发种规则
    UPLOAD_RULES: '上传规则：',
    UPLOAD_RULES_COUNT: '6',
    UPLOAD_RULES_CONTENT: [
      '种子文件的Tracker地址必须为：<mark><strong>{{url}}</strong></mark>.',
      '种子文件的 TMDB_ID 必须是 The Movie DB 相对应的资源ID号，<strong><a href="https://www.themoviedb.org/" target="_blank">您可以从这里找到ID号</a></strong>.',
      '资源的详细信息，系统会自动载入，如无误可直接提交.',
      '请为资源选择匹配的一个或多个标签，它会在您的搜索结果中发挥重大作用.',
      '种子文件提交后，可能会由后台管理人员进行审批，不符合规则的种子会被直接删除.',
      '如需其它帮助，请与我们的管理员联系：<strong><a href="mailto:#">{{admin}}</a></strong>.'
    ],

    //HomeController & home views
    LOADING_TOP: '正在推荐资源，请稍候...',
    TOP_MOVIE_INFO_ERROR: '获取电影Top列表失败',

    //element title/alt
    TITLE_ALT: {
      SEEDS: '做种用户数',
      LEECHERS: '正在下载数',
      FINISHED: '完成下载数',
      IMDB_VOTES: 'IMDB 评分',
      MORE_TAGS: '显示更多检索标签',
      RESET_TAGS: '重置检索条件与标签',
      DOWNLOAD_TORRENT: '下载种子文件'
    },

    //table fields
    TABLE_FIELDS: {
      //torrent
      INFO: '种子信息',
      SIZE: '大小',
      SEEDS_LEECHERS_FINISHED: '上/下/完',
      PUBLISHER: '发布者',
      LIFETIME: '存活时间',
      VOTES: '评分',

      //peer
      USERNAME: '用户',
      UPLOADED: '已上传/速度',
      DOWNLOADED: '已下载/速度',
      RATIO: '分享率',
      FINISHED: '已完成',
      STARTED: '开始时间',
      ACTIVE: '活动状态',
      CLIENT: '客户端',
      CONNECTABLE: '可连接',

      //ranking
      UPLOAD: '已上传',
      DOWNLOAD: '已下载',
      SEEDED: '正在做种',
      LEECHED: '正在下载',
      SCORE: '积分',
      JOINED: '加入时间'
    },

    //page title
    PAGETITLE: {
      UPLOAD: '上传',
      MOVIE_LIST: '电影列表',
      TORRENT_INFO: '种子信息',
      RANKING: '排行榜',
      RULES: '规则',
      VIP: 'Vip',
      FORUM: '论坛',
      ADMIN_USER_LIST: '用户管理',
      ADMIN_USER_VIEW: '查看用户',
      ADMIN_USER_EDIT: '编辑用户',
      ADMIN_TORRENTS_LIST: '种子管理'
    },

    //TorrentsController & views
    MOVIE_PAGE_INFO_ERROR: '获取电影分页列表失败',
    MOVIE_PAGE_INFO_EMPTY: '没有找到信息，请更换标签重新检索',
    TAGS_SEARCH: '标签检索',
    CA_KEYWORD: '关键字',
    PH_KEYWORD: '搜索关键字',
    CLEAR_ALL_CONDITION: '清空所有条件',
    MORE_TAGS: '显示更多标签',
    CA_RESET: '重置条件',
    CA_DOWNLOAD: '下载种子',
    TORRENT_DOWNLOAD_ERROR: '种子文件下载失败',
    TORRENTS_DOWNLOAD_SUCCESSFULLY: '种子文件下载成功',

    //torrent info
    UNIT_MILLION: '百万美元',
    UNIT_MITUTE: '分钟',
    TMDB_INFO_OK: '装载 TMDB 电影信息成功',
    TMDB_INFO_FAILED: '装载 TMDB 电影信息失败',
    TAB_VIDEO_INFO: '视频信息',
    TAB_USER_SUBTITLE: '字幕信息',
    TAB_USER_INFO: '用户信息',
    TAB_OTHER_TORRENTS: '其它种子',
    TAB_MY_PANEL: '我的面板',
    TAB_ADMIN_PANEL: '管理员面板',

    TRANCKER_URL: 'Tracker 地址',
    ATTRIBUTE_TAGS: '视频属性(标签)',
    VIDEO_NFO: '视频 NFO',
    VIDEO_SIZE: '视频文件大小',
    VIDEO_SALE_INFO: '视频促销信息',
    SALE_EXPIRES_TIME: '过期',
    UPLOAD_SUBTITLE: '上传字幕文件',
    SUBTITLE_LIST: '字幕列表',
    SUBTITLE_RULES: {
      0: '如果你有该种子的字幕文件，你可以在这里上传.',
      1: '请注意字幕文件名的正确格式，比如: Sing.2016.3D.HKG.BluRay.1080p.AVC.Atmos.TrueHD7.1-MTeam.chs&eng.srt'
    },
    MY_TORRENT_RULES: {
      0: '这个种子文件是由你自己上传的，你可以对其做如下操作.',
      1: '如需其它帮助，请与我们的管理员联系：<strong><a href="mailto:#">{{admin}}</a></strong>.'
    },
    ENTER_VIDEO_NFO: '请输入视频NFO信息',
    TORRENT_SEED_USERS: '做种用户列表',
    TORRENT_LEECHER_USERS: '下载用户列表',
    TORRENT_FINISHED_USERS: '完成用户列表',
    SUBTITLE_UPLOAD_FAILED: '字幕文件上传失败',
    SUBTITLE_DELETE_ICON_TITLE: '删除字幕文件',
    SUBTITLE_CONFIRM_OK: '删除',
    SUBTITLE_CONFIRM_CANCEL: '取消',
    SUBTITLE_CONFIRM_HEADER_TEXT: '删除确认',
    SUBTITLE_CONFIRM_BODY_TEXT: '你确定要删除这条字幕吗?',
    SUBTITLE_DOWNLOAD_SUCCESSFULLY: '字幕文件下载成功',
    SUBTITLE_DOWNLOAD_ERROR: '字幕文件下载失败',
    SUBTITLE_DELETE_SUCCESSFULLY: '字幕文件删除成功',
    SUBTITLE_DELETE_ERROR: '字幕文件删除失败',
    OTHER_TORRENT_LIST_TITLE: '该资源有 {{x}} 个其它版本的种子, 你可以从下面查看或直接下载:',

    ADMIN_BASIC_COMMAND: '操作命令',
    ADMIN_BASIC_DELETE: '删除种子',
    ADMIN_SALE_TYPE_SET: '种子促销类型',

    TORRENT_DELETE_CONFIRM_OK: '删除',
    TORRENT_DELETE_CONFIRM_CANCEL: '取消',
    TORRENT_DELETE_CONFIRM_HEADER_TEXT: '删除确认',
    TORRENT_DELETE_CONFIRM_BODY_TEXT: '你确定要删除这条种子信息吗?',
    TORRENT_DELETE_SUCCESSFULLY: '种子信息删除成功',
    TORRENT_DELETE_ERROR: '种子信息删除失败',
    TORRENT_SETSALETYPE_SUCCESSFULLY: '种子促销类型设置成功',
    TORRENT_SETSALETYPE_ERROR: '种子促销类型设置失败',

    //page text
    PAGE_TEXT_FIRST: '首页',
    PAGE_TEXT_PREVIOUS: '上一页',
    PAGE_TEXT_NEXT: '下一页',
    PAGE_TEXT_LAST: '尾页',

    //comment
    USER_COMMENT_LIST: '用户评论',
    POST_NEW_COMMENT: '发表新评论',
    EDIT_COMMENT: '编辑评论',
    REPLY_COMMENT: '回复评论',
    SUBMIT_COMMENT: '提交评论',
    SUBMIT_CANCEL: '取消',
    MARKDOWN_LINK: '排版支持 Markdown 全部格式',
    COMMENT_REPLY_BUTTON: '@ 楼主并回复',
    COMMENT_REPLY_DELETE: '删除',
    COMMENT_REPLY_EDIT: '编辑',
    COMMENT_EDITED_INFO: '编辑于',
    COMMENT_CONFIRM_OK: '删除',
    COMMENT_CONFIRM_CANCEL: '取消',
    COMMENT_CONFIRM_HEADER_TEXT: '删除确认',
    COMMENT_CONFIRM_BODY_TEXT: '你确定要删除这条评论吗?',
    COMMENT_CONFIRM_BODY_TEXT_REPLY: '你确定要删除这条评论回复吗?',
    COMMENT_EDIT_ICON_TITLE: '编辑回复',
    COMMENT_DELETE_ICON_TITLE: '删除回复',

    //TorrentsUploadController
    TORRENTS_UPLOAD_SUCCESSFULLY: '文件上传成功',
    TORRENTS_UPLOAD_FAILED: '文件上传失败',
    TORRENTS_NO_FILE_SELECTED: '请选择种子文件后再做尝试',

    SELECT_TORRENT_FILE: '请选择种子文件',
    SELECT_FILE: '选择文件',
    DO_UPLOAD: '上传',
    ENTER_TMDB_ID: '请输入TMDB_ID 　<span style="font-size: 10pt;">[<a href="https://www.themoviedb.org/" target="_blank">在 themofiedb.org 上查找</a>]</span>',
    LOAD_TMDB_INFO: '检索信息',
    TMDB_ID: 'TMDB ID',
    TMDB_ID_OK: 'MDB ID 正确，检索信息成功!',
    TMDB_ID_ERROR: 'MDB ID 错误，检索信息失败!',
    TMDB_ID_REQUIRED: '请输入 TMDB ID',
    TMDB_MOVIE_INFO: 'TMDB 视频信息',
    TMDB_IS_LOADING: '正在检索视频信息，请稍候...',
    SELECT_TAGS: '请为资源选择合适的标签',
    TORRENTS_SUBMIT_UPLOAD: '同意上传协议，并提交',
    SUBMIT_BUTTON: '已备妥，现在提交',
    CANCEL_BUTTON: '算了，以后再说',
    AGREE_RULES: '我已阅读并同意站内所有协议条款，<a href="#">协议条款</a>',
    DOWNLOAD_TORRENT: '下载种子',

    //ranking view
    PAGE_HEADER_RANKING_UPLOAD: '上传量排行榜',
    PAGE_HEADER_RANKING_DOWNLOAD: '下载量排行榜',
    PAGE_HEADER_RANKING_RATIO: '分享率排行榜',
    PAGE_HEADER_RANKING_SCORE: '积分排行榜',

    //admin views
    USERS_LIST: '用户列表',
    USERS_UPDATE: '修改',

    //vip,rules views
    BUTTON_DNATE: '捐 赠 Vip',

    //user settings
    SETTINGS: '控制面版',
    BUTTON_SAVE_PROFILE: '保存',
    BUTTON_SELECT_PICTURE: '选择图片',
    BUTTON_USE_THIS_PICTURE: '应用图片',
    BUTTON_CANCEL: '取消',
    BUTTON_COMPLETE: '完成',
    BUTTON_SAVE_PASSWORD: '保存密码',
    CAPTION_CURRENT_PASSWORD: '当前密码',
    CAPTION_NEW_PASSWORD: '新密码',
    CAPTION_VERIFY_PASSWORD: '验证密码',
    CAPTION_REQUIRED_CURRENT_PASSWORD: '请输入当前密码.',
    CAPTION_REQUIRED_NEW_PASSWORD: '请输入新密码.',
    CAPTION_REQUIRED_VERIFY_PASSWORD: '请再输入一次新密码.',
    CAPTION_PASSWORD_NOT_MATCH: '两次输入的新密码不一致.',

    //footer view
    MIT_PROTOCOL: '本项目源码受 <a href="https://github.com/twbs/bootstrap/blob/master/LICENSE" target="_blank">MIT</a> 开源协议保护',
    GIT_REPO: 'Power by &copy;meanTottent，<a href="https://github.com/taobataoma/meanTorrent" target="_blank">GitHub 源码仓库</a>',

    ///////////////////////the movie db fields////////////////////////////////
    TMDB_FIELDS: {
      ID: 'id',
      IMDB_ID: 'imdb_id',
      IMDB_LINK: 'IMDB链接',
      TMDB_LINK: 'TMDB链接',
      HOMEPAGE: '主页',
      ADULT: '成人级别',
      BUDGET: '制作预算',
      REVENUE: '票房收入',
      ORIGINAL_LANGUAGE: '原语言',
      ORIGINAL_TITLE: '原片名',
      TITLE: '译名',
      BELONGS_TO_COLLECTION: '集合',
      GENRES: '类型',
      OVERVIEW: '剧情',
      POPULARITY: 'popularity',
      PRODUCTION_COMPANIES: '制作',
      PRODUCTION_COUNTRIES: '国家',
      RELEASE_DATE: '上映',
      RUNTIME: '片长',
      SPOKEN_LANGUAGES: '语言',
      STATUS: '状态',
      TAGLINE: '推广语',
      VIDEO: 'video',
      VOTE_AVERAGE: 'IMDB评分',
      VOTE_COUNT: '参评人数',
      VOTE_UNIT: '人',
      BACKDROP_PATH: '背景海报',
      POSTER_PATH: '海报',
      CAST: '主演：',
      DIRECTOR: '导演'
    },

    /////////////////////////resources tag fields///////////////////////////////////
    RESOURCESTAGS: {
      TYPE: {
        SELF: '类型',
        BLU_RAY: 'BLU_RAY',
        REMUX: 'REMUX',
        ENCODE: 'ENCODE'
      },

      RESOLUTION: {
        SELF: '解析度',
        S4K: '4K',
        S1080P: '1080P',
        S720P: '720P'
      },

      VIDEO: {
        SELF: '视频编码',
        AVC: 'AVC',
        X265: 'X265',
        X264: 'X264'
      },

      AUDIO: {
        SELF: '音频编码',
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
        SELF: '排行榜',
        IMDB_TOP100: 'IMDB TOP100',
        IMDB_TOP250: 'IMDB TOP250',
        DOUBAN_TOP100: '豆瓣 TOP100',
        DOUBAN_TOP250: '豆瓣 TOP250'
      },

      REGION: {
        SELF: '地区',
        CHINA: '中国',
        JAPAN: '日本',
        KOREA: '韩国',
        INDIA: '印度',
        ARAB: '阿拉伯'
      },

      MODIFY: {
        SELF: '后期编辑',
        DIY: 'DIY',
        GUOPEI: '国配',
        ZHONGZI: '中字'
      }
    }
  };

  // **************************************************
  // 中文翻译结束
  // **************************************************

  // config $translateProvider
  transConfig.$inject = ['$translateProvider'];
  function transConfig($translateProvider) {
    $translateProvider.translations('zh', string_zh);
  }

}(ApplicationConfiguration));
