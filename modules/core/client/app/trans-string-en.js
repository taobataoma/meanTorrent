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

  var string_en = {
    COMINGSOON: 'coming soon...',
    DEMO_INFO: 'Welcome to demo site, you can sign up manual to create a normal account or sign in as demo admin with account <mark>demo</mark> and password <mark>demoAdmin12#</mark>, but don`t delete any demo data please, thanks!',
    WARNING_POPUP_STRING: 'This is a <strong style="color:#f00">DEMO SITE</strong>, all resources are for download testing only, please delete it within 24 hours after the test is completed, we recommend that you buy genuine resources!',

    //client topbar menu
    MENU_CHAT: 'Chat',
    MENU_TORRENTS: 'Torrents',
    MENU_TORRENTS_ADMIN: 'Manage Torrents',
    MENU_TORRENTS_ADMIN_EDAU: 'Announce Edit',
    MENU_ADMIN_MESSAGES: 'System Messages',
    MENU_ADMIN_TRACE: 'System Traces',
    MENU_ADMIN_FORUMS_CONFIGURE: 'Forums Configure',
    MENU_ADMIN_FORUMS_MANAGEMENT: 'Forums Management',
    MENU_USERS_ADMIN: 'Manage User',
    MENU_UPLOAD: 'Upload',
    MENU_FORUMS: 'Forums',
    MENU_RANKING: 'Ranking',
    MENU_RULES: 'Rules',
    MENU_VIP: 'VIP',
    MENU_ADMIN: 'Admin',

    //sub menu of torrents
    MENU_TORRENTS_SUB: {
      MOVIE: 'Movie',
      TVSERIAL: 'TVSerial',
      MUSIC: 'Music',
      OTHER: 'Other'
    },

    //client menu
    SIGNOUT: 'Sign out',
    SIGNIN: 'Sign In',
    SIGNUP: 'Sign Up',
    MENU_MESSAGE_BOX: 'Message Box',
    MENU_SCORE_LEVEL: 'Score Level',
    MENU_MY_INVITE: 'My Invitations',
    MENU_ACCOUNT_STATUS: 'Account Status',
    EDIT_PROFILE: 'Edit Profile',
    EDIT_PROFILE_PIC: 'Edit Profile Picture',
    CHANGE_PASSWORD: 'Change Password',
    RESET_PASSKEY: 'Reset Passkey',
    MANAGE_SOCIAL_ACCOUNTS: 'Manage Social Accounts',

    //HomeController & home views
    LOADING_TOP: 'Loading recommended info, please waiting...',
    TOP_MOVIE_INFO_ERROR: 'Get movie top info failed',
    NEWEST_MOVIE_LIST: 'Newest Movie Torrents',
    NEWEST_TV_LIST: 'Newest TV Serial Torrents',

    //element title/alt
    TITLE_ALT: {
      SEEDS: 'Seeds users',
      LEECHERS: 'Leechers users',
      FINISHED: 'Finished users',
      IMDB_VOTES: 'IMDB Votes',
      MORE_TAGS: 'Show More Search Tags',
      RESET_TAGS: 'Reset All Search Tags',
      DOWNLOAD_TORRENT: 'Doanload the torrent'
    },

    //table fields
    TABLE_FIELDS: {
      //torrent
      INFO: 'Torrent info',
      SIZE: 'Size',
      SEEDS_LEECHERS_FINISHED: 'S/L/F',
      PUBLISHER: 'Uploader',
      ADMIN_TOOLS: 'Admin Tools',
      LIFETIME: 'Life',
      VOTES: 'Votes',

      //peer
      USERNAME: 'DisplayName',
      UPLOADED: 'Uploaded/Speed',
      DOWNLOADED: 'Downloaded/Speed',
      RATIO: 'Ratio',
      FINISHED: 'Finished',
      STARTED: 'Started',
      ACTIVE: 'Active',
      CLIENT: 'Client',
      CONNECTABLE: 'Connectable',

      //ranking
      UPLOAD: 'Uploaded',
      DOWNLOAD: 'Downloaded',
      SEEDED: 'Seeded',
      LEECHED: 'Leeched',
      SCORE: 'Score',
      JOINED: 'Joined'
    },

    //page title
    PAGETITLE: {
      UPLOAD: 'Upload',
      MOVIE_LIST: 'Movie List',
      TV_LIST: 'TV List',
      MUSIC_LIST: 'Music List',
      OTHER_LIST: 'Other List',
      TORRENT_INFO: 'Torrent Info',
      RANKING: 'Ranking',
      RULES: 'Rules',
      VIP: 'Vip',
      FORUM: 'Forum',
      ADMIN_USER_LIST: 'User List',
      ADMIN_USER_VIEW: 'View User',
      ADMIN_USER_EDIT: 'Edit User',
      ADMIN_TORRENTS_LIST: 'Torrents List',
      ADMIN_ANNOUNCE_EDIT: 'Announce Edit',
      ADMIN_MESSAGES: 'System Messages',
      ADMIN_TRACES_LIST: 'Traces List',
      ADMIN_FORUMS_CONFIGURE: 'Forums Configure',
      ADMIN_FORUMS_MANAGEMENT: 'Forums Management',
      PASSWORD_FORGOT: 'Password forgot',
      PASSWORD_RESET: 'Password reset',
      MESSAGES_BOX: 'Message Box',
      MESSAGES_SEND: 'Send Message',
      STATUS_ACCOUNT: 'Account Status',
      STATUS_UPLOADED: 'Uploaded',
      STATUS_SEEDING: 'Seeding',
      STATUS_DOWNLOADING: 'Downloading',
      SCORE_DETAIL: 'Score detail',
      INVITATIONS: 'Invitations',
      INVITE_INVALID: 'invalid invitation'
    },

    //sign in, sign up, password
    SIGN: {
      BTN_SIGN_IN: 'Sign in',
      BTN_SIGN_UP: 'Sign up',
      BTN_SUBMIT: 'Submit',
      SIGN_IN: 'Sign in with your account',
      SIGN_SOCIAL: 'Or sign in using your social accounts',
      SIGN_UP: 'Sign up using your email',
      RESET_PASSWORD: 'Reset your password',
      RESTORE_PASSWORD: 'Restore your password',
      USERNAME_OR_EMAIL: 'Username or Email',
      U_PATTERN: 'Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.',
      U_TOOLTIP: 'Please enter a passphrase or password with {{minLength}} or more characters, numbers, lowercase, uppercase, and special characters.',
      U_E_REQUIRED: 'Username or Email is required.',
      U_REQUIRED: 'Username is required.',
      E_REQUIRED: 'Email address is required.',
      E_INVALID: 'Email address is invalid.',
      PASSWORD: 'Password',
      PASSWORD_REQ: 'Password Requirements',
      P_REQUIRED: 'Password is required.',
      FORGOT_PASSWORD: 'Forgot your password?',
      FN_REQUIRED: 'First name is required.',
      LN_REQUIRED: 'Last name is required.',

      NEW_PASSWORD: 'New Password',
      NP_REQUIRED: 'Enter a new password.',
      VERIFY_PASSWORD: 'Verify Password',
      VP_REQUIRED: 'Enter the password again to verify.',
      NP_VP_NOTMATCH: 'Passwords do not match.',
      BTN_UPDATE_PASSWORD: 'Update Password',
      ENTER_USERNAME: 'Enter your account username.',
      RESET_PASS_OK: 'Password successfully reset',
      RESET_PASS_INVALID: 'Password reset is invalid',
      RE_RESET_PASSWORD: 'Ask for a new password reset?'
    },

    //TorrentsController & views
    TOP_LIST_INFO_ERROR: 'Get top list info failed',
    LIST_PAGE_INFO_ERROR: 'Get resources page info failed',
    LIST_PAGE_INFO_EMPTY: 'No resources founded, please change some new tags to research',
    TAGS_SEARCH: 'Tags Search',
    CA_KEYWORD: 'Keyword',
    CA_TORRENT_STATUS: 'Torrent status',
    CA_RESOURCE_TYPE: 'Resource type',
    PH_KEYWORD: 'Search keyword',
    CLEAR_ALL_CONDITION: 'Clear All Condition',
    MORE_TAGS: 'More Tags',
    CA_RESET: 'Reset',
    CA_DOWNLOAD: 'Download',
    TORRENT_DOWNLOAD_ERROR: 'Torrent file download failed',
    TORRENTS_DOWNLOAD_SUCCESSFULLY: 'Torrents file download successfully',

    //torrent info
    UNIT_MILLION: 'million',
    UNIT_MITUTE: 'min',
    TMDB_INFO_OK: 'Load TMDB movie info OK',
    TMDB_INFO_FAILED: 'Load TMDB movie info ERROR',
    TAB_VIDEO_INFO: 'Video Info',
    TAB_USER_SUBTITLE: 'Subtitle Info',
    TAB_USER_INFO: 'User Info',
    TAB_OTHER_TORRENTS: 'Other Torrents',
    TAB_MY_PANEL: 'My Pannel',
    TAB_ADMIN_PANEL: 'Admin Panel',

    ANNOUNCE_URL: 'Announce Url',
    ATTRIBUTE_TAGS: 'Video Attribute (tags)',
    VIDEO_NFO: 'Video NFO',
    VIDEO_SIZE: 'Video Size',
    VIDEO_SALE_INFO: 'Video Sale Info',
    SALE_EXPIRES_TIME: 'expires',
    UPLOAD_SUBTITLE: 'Upload Subtitle file',
    SUBTITLE_LIST: 'Subtitle list',
    SUBTITLE_RULES: {
      0: 'If the torrent has no subtitle files, you have the following actions.',
      1: 'Please note the filename format, such as: <mark>Sing.2016.3D.HKG.BluRay.1080p.AVC.Atmos.TrueHD7.1-MTeam.chs&eng.srt</mark>'
    },
    MY_TORRENT_RULES: {
      0: 'This torrent file is uploaded by yourself, you have actions bellow.',
      1: 'For additional assistance, please contact our administrator: <strong><a href="mailto:#">{{admin}}</a></strong>'
    },
    TORRENT_SEED_USERS: 'Seed Users',
    TORRENT_LEECHER_USERS: 'Leecher Users',
    TORRENT_FINISHED_USERS: 'Finished Users',
    SUBTITLE_UPLOAD_FAILED: 'Failed to upload subtitle file',
    SUBTITLE_DELETE_ICON_TITLE: 'Delete this subtitle',
    SUBTITLE_CONFIRM_OK: 'Delete',
    SUBTITLE_CONFIRM_CANCEL: 'Cancel',
    SUBTITLE_CONFIRM_HEADER_TEXT: 'Delete Confirm',
    SUBTITLE_CONFIRM_BODY_TEXT: 'Are you sure want to delete this subtitle?',
    SUBTITLE_DOWNLOAD_SUCCESSFULLY: 'Subtitle file download successfully',
    SUBTITLE_DOWNLOAD_ERROR: 'Subtitle file download failed',
    SUBTITLE_DELETE_SUCCESSFULLY: 'Subtitle file delete successfully',
    SUBTITLE_DELETE_ERROR: 'Subtitle file delete failed',
    OTHER_TORRENT_LIST_TITLE: 'This resources has {{x}} other version torrent, you can view or download from here:',

    ADMIN_BASIC_COMMAND: 'Basic Command',
    ADMIN_BASIC_REVIEWED: 'Reviewed',
    ADMIN_BASIC_UPDATE: 'Update torrent info from TMDB',
    ADMIN_BASIC_DELETE: 'Delete torrent',
    ADMIN_BASIC_TYPE_SET: 'Sale Type',
    ADMIN_SALE_TYPE_SET: 'Sale Type Set',
    ADMIN_BASIC_RLEVEL_SET: 'Recommend Level',
    ADMIN_RLEVEL_SET: 'Recommend Level Set',

    TORRENT_DELETE_CONFIRM_OK: 'Delete',
    TORRENT_DELETE_CONFIRM_CANCEL: 'Cancel',
    TORRENT_DELETE_CONFIRM_HEADER_TEXT: 'Delete Confirm',
    TORRENT_DELETE_CONFIRM_BODY_TEXT: 'Are you sure want to delete this torrent?',
    TORRENT_DELETE_SUCCESSFULLY: 'Torrent delete successfully',
    TORRENT_DELETE_ERROR: 'Torrent delete failed',
    TORRENT_UPDATE_CONFIRM_OK: 'Update',
    TORRENT_UPDATE_CONFIRM_CANCEL: 'Cancel',
    TORRENT_UPDATE_CONFIRM_HEADER_TEXT: 'Update Confirm',
    TORRENT_UPDATE_CONFIRM_BODY_TEXT: 'Are you sure want to update the torrent info from TMDB?',
    TORRENT_UPDATE_SUCCESSFULLY: 'Torrent info update successfully',
    TORRENT_UPDATE_ERROR: 'Torrent info update failed',
    TORRENT_SETSALETYPE_SUCCESSFULLY: 'Torrent sale type set successfully',
    TORRENT_SETSALETYPE_ERROR: 'Torrent sale type set failed',
    TORRENT_SETREVIEWED_SUCCESSFULLY: 'Torrent status reviewed set successfully',
    TORRENT_SETREVIEWED_ERROR: 'Torrent status reviewed set failed',
    TORRENT_SETRLEVEL_SUCCESSFULLY: 'Torrent recommend level set successfully',
    TORRENT_SETRLEVEL_ERROR: 'Torrent recommend level set failed',

    //page text
    PAGE_TEXT_FIRST: 'First',
    PAGE_TEXT_PREVIOUS: 'Previous',
    PAGE_TEXT_NEXT: 'Next',
    PAGE_TEXT_LAST: 'Last',

    //comment
    USER_COMMENT_LIST: 'User Comments List',
    POST_NEW_COMMENT: 'Post New Comment',
    EDIT_COMMENT: 'Edit Comment',
    REPLY_COMMENT: 'Reply Comment',
    SUBMIT_COMMENT: 'Submit Comment',
    SUBMIT_REPLY: 'Submit Reply',
    SUBMIT_CANCEL: 'Cancel',
    MARKDOWN_LINK: 'Styling with Markdown is supported',
    COMMENT_REPLY_BUTTON: '@ & reply',
    COMMENT_REPLY_DELETE: 'Delete',
    COMMENT_REPLY_EDIT: 'Edit',
    COMMENT_EDITED_INFO: 'Edit at',
    COMMENT_CONFIRM_OK: 'Delete',
    COMMENT_CONFIRM_CANCEL: 'Cancel',
    COMMENT_CONFIRM_HEADER_TEXT: 'Delete Confirm',
    COMMENT_CONFIRM_BODY_TEXT: 'Are you sure want to delete this comment?',
    COMMENT_CONFIRM_BODY_TEXT_REPLY: 'Are you sure want to delete this comment reply?',
    COMMENT_EDIT_ICON_TITLE: 'Edit this reply',
    COMMENT_DELETE_ICON_TITLE: 'Delete this reply',

    //TorrentsUploadController & views
    UPLOAD_RULES: 'Upload Rules:',
    TORRENTS_UPLOAD_SUCCESSFULLY: 'Successfully upload file',
    TORRENTS_UPLOAD_FAILED: 'Failed to upload file',
    TORRENTS_NO_FILE_SELECTED: 'No file selected',

    SELECT_RESOURCE_TYPE: '1. Please select the resource type',
    SELECT_TORRENT_FILE: '2. Please select the torrent file',
    SELECT_FILE: 'Select file',
    DO_UPLOAD: 'Upload',
    ENTER_TMDB_ID: '3. Please enter theMovieDB id',
    LOAD_TMDB_INFO: 'Load info',
    TMDB_ID: 'TMDB ID',
    TMDB_ID_OK: 'TMDB ID is ok! Get info successfully',
    TMDB_ID_ERROR: 'TMDB ID is error! Get info failed',
    TMDB_ID_REQUIRED: 'Please enter TMDB ID',
    TMDB_RESOURCE_INFO: '4. The resource info from TMDB',
    TMDB_IS_LOADING: 'Loading the movie info, please wait...',
    SELECT_SE: '4.1. Please select number of seasons and input number of episodes',
    SELECT_TAGS: '5. Please select any tags for the resources',
    ENTER_VIDEO_NFO: '6. Please enter video NFO',
    TORRENTS_SUBMIT_UPLOAD: '7. Agree the rules and submit your resources',
    SUBMIT_BUTTON: 'OK, SUBMIT NOW',
    CANCEL_BUTTON: 'NO, CANCEL IT',
    AGREE_RULES: 'I agree and already read all the rules, <a href="#">read here</a>',
    DOWNLOAD_TORRENT: 'Download Torrent',

    //ranking view
    PAGE_HEADER_RANKING_UPLOAD: 'Uploaded Ranking',
    PAGE_HEADER_RANKING_DOWNLOAD: 'Downloaded Ranking',
    PAGE_HEADER_RANKING_RATIO: 'Ratio Ranking',
    PAGE_HEADER_RANKING_SCORE: 'Score Ranking',

    //admin views
    USERS_LIST: 'Users',
    USERS_UPDATE: 'Update',
    TORRENT_STATUS_NEW: 'NEW',
    TORRENT_STATUS_REVIEWED: 'REVIEWED',
    TORRENT_STATUS_DELETED: 'DELETED',
    TORRENT_STATUS_ALL: 'ALL',
    TORRENT_RECOMMEND_LEVEL: 'Recommend Level',
    TORRENT_RECOMMEND_LEVEL_ITEM: {
      LEVEL0: 'NONE',
      LEVEL1: 'LEVEL1',
      LEVEL2: 'LEVEL2',
      LEVEL3: 'LEVEL3'
    },

    SET_ROLE_SUCCESSFULLY: 'set user role successfully',
    SET_ROLE_FAILED: 'set user role failed',
    SET_STATUS_SUCCESSFULLY: 'set user status successfully',
    SET_STATUS_FAILED: 'set user status failed',

    SCORE_NUMBER: 'Score number',
    SCORE_TITLE: 'Edit user score',
    SET_SCORE_SUCCESSFULLY: 'set user score successfully',
    SET_SCORE_FAILED: 'set user score failed',

    UPLOADED_NUMBER: 'Uploaded number',
    UPLOADED_TITLE: 'Edit user uploaded (unit: GB)',
    SET_UPLOADED_SUCCESSFULLY: 'set user uploaded successfully',
    SET_UPLOADED_FAILED: 'set user uploaded failed',

    DOWNLOADED_NUMBER: 'Downloaded number',
    DOWNLOADED_TITLE: 'Edit user downloaded (unit: GB)',
    SET_DOWNLOADED_SUCCESSFULLY: 'set user downloaded successfully',
    SET_DOWNLOADED_FAILED: 'set user downloaded failed',

    ANNOUNCE_EDIT_TIP: 'Upload a torrent file, </br>automatic replacement <mark>Announce URL</mark> & <mark>Comment</mark>',
    ANNOUNCE_COMMENT: 'Announce Comment',

    //vip,rules views
    BUTTON_DNATE: 'Donate Vip',

    //user settings
    SETTINGS: 'Settings',
    BUTTON_SAVE_PROFILE: 'Save Profile',
    BUTTON_SELECT_PICTURE: 'Select Picture',
    BUTTON_USE_THIS_PICTURE: 'Use This Picture',
    BUTTON_CANCEL: 'Cancel',
    BUTTON_SET: 'Set',
    BUTTON_COMPLETE: 'Complete',
    BUTTON_SAVE_PASSWORD: 'Save Password',
    CAPTION_CURRENT_PASSWORD: 'Current Password',
    CAPTION_NEW_PASSWORD: 'New Password',
    CAPTION_VERIFY_PASSWORD: 'Verify Password',
    CAPTION_REQUIRED_CURRENT_PASSWORD: 'Your current password is required.',
    CAPTION_REQUIRED_NEW_PASSWORD: 'Enter a new password.',
    CAPTION_REQUIRED_VERIFY_PASSWORD: 'Verify your new password.',
    CAPTION_PASSWORD_NOT_MATCH: 'Passwords do not match.',
    CURRENT_PASSKEY: 'Current Passkey: <mark class="text-danger">{{passkey}}</mark>',
    RESET_PASSKEY_NOTE: 'NOTE: If you reset your passkey, you must re-download all torrent file, and re-add to your download client, it can download or upload.',
    RESET_PASSKEY_CONFIRM_OK: 'Reset',
    RESET_PASSKEY_CONFIRM_CANCEL: 'Cancel',
    RESET_PASSKEY_CONFIRM_HEADER_TEXT: 'Reset Passkey',
    RESET_PASSKEY_CONFIRM_BODY_TEXT: 'Are you sure want to reset your passkey?',
    RESET_PASSKEY_SUCCESSFULLY: 'Passkey reset successfully',
    RESET_PASSKEY_ERROR: 'Passkey reset failed',
    CONNECTED_SOCIAL: 'Connected social accounts::',
    UNCONNECTED_SOCIAL: 'Unconnected social accounts:',

    //user status
    STATUS_ACCOUNT: 'Account Status',
    STATUS_UPLOADED: 'Uploaded torrents',
    STATUS_SEEDING: 'Seeding torrents',
    STATUS_DOWNLOADING: 'Downloading torrents',
    UPLOADED_LIST_ERROR: 'Get uploaded list info failed',
    SEEDING_LIST_ERROR: 'Get seeding list info failed',
    DOWNLOADING_LIST_ERROR: 'Get downloading list info failed',
    STATUS_FIELD: {
      PICTURE: 'Profile picture',
      USERNAME: 'Username',
      FIRST_NAME: 'First name',
      LAST_NAME: 'Last name',
      DISPLAY_NAME: 'Display name',
      EMAIL: 'Email',
      PASSKEY: 'Passkey',
      ROLE: 'Role',
      STATUS: 'Status',
      NORMAL: 'normal',
      BANNED: 'banned',
      UNBANNED: 'unbanned',
      SEALED: 'sealed',
      VIP_START_AT: 'Vip start at',
      VIP_END_AT: 'Vip end at',
      UPLOADED: 'Total uploaded',
      DOWNLOADED: 'Total downloaded',
      RATIO: 'Total ratio',
      SCORE: 'Total score',
      SEEDED: 'Seeded',
      LEECHED: 'Leeched',
      FINISHED: 'Finished',
      DETAIL: 'Detail',
      SIGNUP_DATE: 'Sign up at',
      LATEST_SIGNED_TIME: 'Latest signed at',
      SIGNED_IP: 'Signed IP list',
      LEECHED_IP: 'Leeched IP list',
      BT_CLIENT: 'Leeched BT Client list'
    },
    TORRENT_TYPE_LABEL: {
      MOVIE: 'Movie',
      TVSERIAL: 'TVSerial',
      MUSIC: 'Music',
      OTHER: 'Other'
    },
    TORRENT_STATUS_LABEL: {
      NEW: 'New',
      REVIEWED: 'Reviewed'
    },

    //user score
    SCORE: {
      CURRENT_SCORE: 'Current score:',
      HOW_TO_GET_LEVEL: 'How to count user level?',
      HOW_TO_GET_SCORE: 'How to get score number?'
    },
    EXCHANGE_INVITATION: 'Exchange an invitation ({{score}} scores)',
    EXCHANGE_INVITATION_CONFIRM_OK: 'Exchange',
    EXCHANGE_INVITATION_CONFIRM_CANCEL: 'Cancel',
    EXCHANGE_INVITATION_CONFIRM_HEADER_TEXT: 'Exchange Confirm',
    EXCHANGE_INVITATION_CONFIRM_BODY_TEXT: 'Are you sure want to exchange an invitation with {{score}} scores?',
    EXCHANGE_INVITATION_SUCCESSFULLY: 'Exchange invitation successfully',
    EXCHANGE_INVITATION_ERROR: 'Exchange invitation failed',
    INVITE_CLOSED: 'The invitation function is closed and you cannot exchange an invitations ...',
    INVITE_INFO: 'The invitation function is closed and only admin/oper can use it ...',
    NOTE_CAPTION: 'Note!',
    NOTE_TIP: 'Tip:',

    //invitation
    INVITATION: {
      MY_INVITATION: 'My invitations',
      USED_INVITATION: 'Used invitations',
      INVITE_NOTE: 'Please attention to the expiration time of the time limit invitation is {{hours}} hours.',
      SIGN_NOTE: 'Please attention to the expiration time of sign in with the invitation is {{hours}} hours.',
      TITLE_CREATEDAT: 'CreatedAt',
      TITLE_EXPIRESAT: 'ExpiresAt',
      TITLE_INVITEDAT: 'InvitedAt',
      TITLE_SIGNINAT: 'SigninAt',
      TITLE_SIGNINID: 'SigninID',
      TITLE_OPERATION: 'Operation',
      TITLE_TOKEN: 'Token',
      TITLE_EMAIL: 'Email',
      TITLE_SEND: 'Send an invitation',
      TITLE_STATUS: 'Status',
      TITLE_STATUS_REGED: 'Signed',
      TITLE_STATUS_UNREGED: 'Unsigned',
      TITLE_STATUS_EXPIRED: 'Expired'
    },
    GET_INVITATIONS_ERROR: 'Get invitations failed',
    BUTTON_INVITE: 'Send',
    BUTTON_SEARCH: 'Search',
    INPUT_EMAIL: 'email',
    SEND_INVITE_SUCCESSFULLY: 'Send invitation successfully',
    SEND_INVITE_ERROR: 'Send invitation failed',
    INVALID_INVITATION_TIP: 'Invalid invitation, maybe the invitation is expired.',
    INVITATION_IS_EMPTY: 'There are no invitations available!',
    INVITATION_USED_IS_EMPTY: 'There are no used invitations!',

    //user message box
    MESSAGES_BOX: 'Messages Box',
    MESSAGES_SEND: 'Send Messages',
    ADMIN_MESSAGES_SEND: 'Send System Messages',
    MESSAGES_SEND_BUTTON: '　　Send　　',
    MESSAGES_IS_EMPTY: 'Messages Box is empty!',
    MESSAGES_FIELD: {
      TO: 'Send to:',
      TYPE: 'Message type:',
      TITLE: 'Title:',
      CONTENT: 'Content:',
      TO_REQUIRED: 'Please enter message receiver',
      TT_REQUIRED: 'Please enter message title',
      CT_REQUIRED: 'Please enter message content',
      LIST_TITLE: 'Title',
      LIST_TITLE_CONTENT: 'Title & Content',
      LIST_REPLIES: 'Replies',
      LIST_READERS: 'readers',
      LIST_TYPE: 'Type',
      LIST_SENDAT: 'SendedAt',
      LIST_SELECT: 'Select',
      INFO_SEND_TO: 'send to',
      INFO_SEND_AT: 'at',
      LAST_REPLY_AT: 'Latest reply at',
      NEW_MSG: 'New messages'
    },
    BUTTON_MESSAGE_DELETE: '　Delete　',
    BUTTON_MESSAGE_CLOSE: ' Close (esc) ',
    BUTTON_MESSAGE_REPLY: '　Reply　',

    MESSAGE_TYPE_USER: 'User message',
    MESSAGE_TYPE_SYSTEM: 'System message',
    MESSAGE_TYPE_ADVERT: 'Advert message',
    MESSAGE_TYPE_NOTICE: 'Notice message',
    MESSAGE_SEND_SUCCESSFULLY: 'Message send successfully',
    MESSAGE_SEND_FAILED: 'Message send failed',
    MESSAGE_DELETED_SUCCESSFULLY: 'Message deleted successfully',
    MESSAGE_DELETED_ERROR: 'Message deleted failed',

    MESSAGE_DELETE_CONFIRM_OK: 'Delete',
    MESSAGE_DELETE_CONFIRM_CANCEL: 'Cancel',
    MESSAGE_DELETE_CONFIRM_HEADER_TEXT: 'Delete Confirm',
    MESSAGE_DELETE_CONFIRM_BODY_TEXT_MANY: 'Are you sure want to delete these messages?',
    MESSAGE_DELETE_CONFIRM_BODY_TEXT: 'Are you sure want to delete this message?',

    MESSAGE_TO_ICON_TITLE: 'Send a message to',

    //traces
    ADMIN_TRACES_LIST: 'Traces List',
    TRACES_IS_EMPTY: 'Traces is empty!',
    TRACES_FIELDS: {
      USERNAME: 'Username',
      CONTENT: 'Trace Content',
      TYPE: 'Action Type',
      CREATEDAT: 'CreatedAt'
    },

    //chat view
    CHAT_USERS_LIST: 'Users List',
    CHAT_WELCOME: 'Welcome to join the chat room, please follow the chat rules, and have a good time!',
    CHAT_PLACEHOLDER_INPUT: 'input new message and press enter',
    CHAT_USER_JOIN: 'is now connected and join the room.',
    CHAT_USER_QUIT: 'is now disconnect and quit the room.',
    CHAT_CLEAN_MESSAGE: 'Clean message list',
    CHAT_BOLD_MESSAGE: 'Bold font style, please use tag: <b>message</b>',
    CHAT_ITALIC_MESSAGE: 'Italic font style, please use tag: <i>message</i>',
    CHAT_MESSAGE_ALREADY_CLEAN: '*** chat messages list already be cleaned',
    CHAT_FONT_BOLD: 'Font Bold',
    CHAT_FONT_ITALIC: 'Font Italic',
    CHAT_BAN_KICK: 'Kick out and ban IP',
    CHAT_BAN_KICK_REASON: 'you are not grateful at here',
    CHAT_BAN_KICK_MESSAGE: '{{who}} was kicked and ban by {{by}} ({{reason}})',

    CHAT_CONFIRM_BAN_OK: 'Ban & Kick',
    CHAT_CONFIRM_BAN_CANCEL: 'Cancel',
    CHAT_CONFIRM_BAN_HEADER_TEXT: 'Ban & Kick Confirm',
    CHAT_CONFIRM_BAN_BODY_TEXT: 'Are you sure want to kick this user and ban the ip?',
    CHAT_DISCONNECT: 'disconnect from server, please check your network or chat server is down',
    CHAT_FONT_COLOR: 'Font color',

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
      CAST: 'cast:',
      DIRECTOR: 'Director',

      ORIGINAL_NAME: 'original_name',
      NAME: 'name',
      FIRST_AIR_DATE: 'first air date',
      LAST_AIR_DATE: 'last air date',
      NETWORK: 'Network',
      NUMBER_OF_SEASONS: 'total seasons',
      NUMBER_OF_EPISODES: 'total episodes',
      TOTAL_SE: 'total S.E',
      THIS_SE: 'this S.E',
      UNIT_EPISODES: 'episodes',
      UNIT_SEASONS: 'seasons',
      EPISODES_INPUT_TIP: 'tip: Only accepts numbers 0-9 and characters minus, for example：9 is 9th episode, 1-30 is first to thirty episode, like 001 12 01-30 12-45 45-127 etc.'
    },

    //forum
    FORUMS: {
      FORUM_TITLE: 'meanTorrent Forums',
      FORUM_SUB_TITLE: 'Welcome to meanTorrent forums!',
      HOME_INDEX: 'Forums Home',
      BTN_ADD_FORUM: 'Add New Forum',
      BTN_EDIT_FORUM: 'Edit Forum',
      BTN_ADD: '　　Add　　',
      BTN_EDIT: '　　Edit　　',
      BTN_SAVE: '　Save　',
      BTN_CANCEL: ' Cancel ',
      LINK_EDIT: 'Edit',
      BTN_DELETE: ' 　Delete　 ',
      BTN_SUBMIT: 'Submit New Topic',
      BTN_POST_NEW_TOPIC: 'Post New Topic',
      BTN_POST_NEW_REPLY: 'Post New Reply',
      ADD_SUCCESSFULLY: 'Forum added successfully',
      ADD_FAILED: 'Forum added failed',
      EDIT_SUCCESSFULLY: 'Forum edited successfully',
      EDIT_FAILED: 'Forum edited failed',
      DELETE_SUCCESSFULLY: 'Forum deleted successfully',
      DELETE_FAILED: 'Forum deleted failed',
      DELETE_CONFIRM_OK: 'Delete',
      DELETE_CONFIRM_CANCEL: 'Cancel',
      DELETE_CONFIRM_HEADER_TEXT: 'Delete Confirm',
      DELETE_CONFIRM_BODY_TEXT: 'Are you sure want to delete this forum?',
      MODERATOR_TITLE: 'Add Moderator',
      ADD_MODERATOR_SUCCESSFULLY: 'Add moderator successfully',
      ADD_MODERATOR_FAILED: 'Add moderator failed',
      REMOVE_MODERATOR_SUCCESSFULLY: 'Remove moderator successfully',
      REMOVE_MODERATOR_FAILED: 'Remove moderator failed',
      REMOVE_CONFIRM_BODY_TEXT: 'Are you sure want to delete this moderator?',
      PT_REQUIRED: 'Please enter topic title',
      PC_REQUIRED: 'Please enter topic content',
      POST_SEND_SUCCESSFULLY: 'Post new topic successfully',
      POST_SEND_FAILED: 'Post new topic failed',
      REPLY_EDIT_SUCCESSFULLY: 'Reply content modify successfully',
      REPLY_EDIT_FAILED: 'Reply content modify failed',

      CATEGORY: {
        AFFAIRS: 'Affairs',
        DISCUSS: 'Discuss',
        BUSINESS: 'Business'
      },
      FIELDS: {
        NAME: 'Forum Name',
        ORDER: 'Forum Order',
        CMD: 'Command',
        MODERATORS: 'Moderators',
        DESC: 'Description',
        CATEGORY: 'Category',
        READONLY_POST: 'Only oper/admin can post new topic',
        READONLY_REPLY: 'disabled user to post new topic',
        TOPICS: 'Topics',
        REPLIES: 'Replies',
        VIEWS: 'Views',
        LAST_REPLY: 'Last Reply',
        TITLE: 'Title',
        CONTENT: 'Content',
        POST_BY: 'by {{user}} post at {{createdAt}}',
        REPLY_BY_1: 'by {{user}}',
        REPLY_BY_2: 'reply at {{createdAt}}',
        REPLY_BY_3: 'post at {{createdAt}}'
      },
      TITLES: {
        QUOTE: 'quote and reply',
        EDIT: 'edit reply',
        DELETE: 'delete reply'
      }
    },

    /////////////////////////resources tag fields///////////////////////////////////
    RESOURCESTAGS: {
      TYPE: {
        SELF: 'Type',
        BLU_RAY: 'BLU_RAY',
        WEB_DL: 'WEB_DL',
        REMUX: 'REMUX',
        ENCODE: 'ENCODE'
      },

      RESOLUTION: {
        SELF: 'Resolution',
        S4K: '4K',
        S1080P: '1080p',
        S1080I: '1080i',
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
        AC3: 'AC3',
        LPCM: 'LPCM',
        DTS: 'DTS',
        DTS_HD: 'DTS HD',
        ATMOS_TRUEHD: 'Atmos TrueHD'
      },

      CHANNEL: {
        SELF: 'Audio Channel',
        C20: '2.0 chnnel',
        C51: '5.1 channel',
        C71: '7.1 channel'
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
        USA: 'USA',
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
    $translateProvider.translations('en', string_en);
  }

}(ApplicationConfiguration));
