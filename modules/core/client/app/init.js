(function (app) {
  'use strict';

  // Start by defining the main module and adding the module dependencies
  angular
    .module(app.applicationModuleName, app.applicationModuleVendorDependencies);

  // Setting HTML5 Location Mode
  angular
    .module(app.applicationModuleName)
    .config(bootstrapConfig)
    .config(localStorageModuleConfig)
    .config(transConfig)
    .config(markedConfig)
    .config(cacheConfig)
    .run(scrollToTopOfPage)
    .run(setDefaultLang)
    .run(writeLeaveTime);

  /**
   * bootstrapConfig
   * @type {string[]}
   */
  bootstrapConfig.$inject = ['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider'];

  function bootstrapConfig($compileProvider, $locationProvider, $httpProvider, $logProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');

    // Disable debug data for production environment
    // @link https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(app.applicationEnvironment !== 'production');
    $logProvider.debugEnabled(app.applicationEnvironment !== 'production');
  }

  /**
   * localStorageModuleConfig
   * @type {string[]}
   */
  localStorageModuleConfig.$inject = ['localStorageServiceProvider'];

  function localStorageModuleConfig(localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('meanTorrent')
      .setStorageType('localStorage')
      .setDefaultToCookie(true)
      .setNotify(true, true);
  }

  /**
   * transConfig
   * @type {string[]}
   */
  transConfig.$inject = ['$translateProvider'];

  function transConfig($translateProvider) {
    $translateProvider.useSanitizeValueStrategy(null);
  }

  /**
   * scrollToTopOfPage
   * @type {string[]}
   */
  scrollToTopOfPage.$inject = ['$rootScope', '$anchorScroll'];

  function scrollToTopOfPage($rootScope, $anchorScroll) {
    $rootScope.$on('$locationChangeSuccess', function () {
      $anchorScroll();
    });
  }

  /**
   * setDefaultLang
   * @type {string[]}
   */
  setDefaultLang.$inject = ['$translate', 'getStorageLangService'];

  function setDefaultLang($translate, getStorageLangService) {
    var user_lang = getStorageLangService.getLang();

    $translate.use(user_lang);
  }

  /**
   * writeLeaveTime
   * @type {string[]}
   */
  writeLeaveTime.$inject = ['localStorageService', '$window'];

  function writeLeaveTime(localStorageService, $window) {
    $window.onbeforeunload = function () {
      localStorageService.set('last_leave_time', Date.now());
    };
  }

  /**
   * markedConfig
   * @type {string[]}
   */
  markedConfig.$inject = ['markedProvider'];

  function markedConfig(markedProvider) {
    markedProvider.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: true,
      highlight: function (code, lang) {
        /*global hljs*/
        if (lang) {
          return hljs.highlight(lang, code, true).value;
        } else {
          return hljs.highlightAuto(code).value;
        }
      }
    });
    markedProvider.setRenderer({
      //link: function (href, title, text) {
      //  return '<a ng-click="vm.markLinkClick($event, item);" href="' + href + '"' + (title ? ' title="' + title + '"' : '') + ' target="_blank">' + text + '</a>';
      //},
      heading: function (text, level) {
        return '<h' + level + '>' + replaceEmoji(text) + '</h' + level + '>\n';
      },
      blockquote: function (quote) {
        return '<blockquote>\n' + replaceEmoji(quote) + '</blockquote>\n';
      },
      listitem: function (text) {
        return '<li>' + replaceEmoji(text) + '</li>\n';
      },
      table: function (header, body) {
        return '<table class="table table-hover table-striped margin-bottom-10"><thead>' + header + '</thead><tbody>' + body + '</tbody></table>';
      },
      tablecell: function (content, flags) {
        var type = flags.header ? 'th' : 'td';
        var tag = flags.align
          ? '<' + type + ' style="text-align:' + flags.align + '">'
          : '<' + type + '>';
        return tag + replaceEmoji(content) + '</' + type + '>\n';
      },
      paragraph: function (text) {
        return '<p>' + replaceEmoji(text) + '</p>';
      },
      html: function (html) {
        return replaceEmoji(html);
      },
      strong: function (text) {
        return '<strong>' + replaceEmoji(text) + '</strong>';
      },
      em: function (text) {
        return '<em>' + replaceEmoji(text) + '</em>';
      },
      del: function (text) {
        return '<del>' + replaceEmoji(text) + '</del>';
      },
      text: function (text) {
        return replaceEmoji(text);
      }
    });
  }

  function replaceEmoji(text) {
    var RexStr = /:([A-Za-z0-9_\-\+]+?):/g;
    text = text.replace(RexStr, function (match, emoji) {
      return '<img src="'
        + '/graphics/emojis/'
        + encodeURIComponent(emoji)
        + '.png"'
        + ' alt="'
        + emoji
        + '"'
        + ' title="'
        + emoji
        + '"'
        + ' class="emoji" align="absmiddle" height="20" width="20">';
    });
    return text;
  }

  /**
   * cacheConfig
   * @type {string[]}
   */
  cacheConfig.$inject = ['CacheFactoryProvider', 'MeanTorrentConfigProvider'];

  function cacheConfig(CacheFactoryProvider, MeanTorrentConfigProvider) {
    var cacheConfig = MeanTorrentConfigProvider.meanTorrentConfig().cache;
    angular.extend(CacheFactoryProvider.defaults, {
      maxAge: cacheConfig.maxAge,
      recycleFreq: cacheConfig.recycleFreq,
      deleteOnExpire: 'aggressive',
    });
  }

  /**
   * init
   */
  // Then define the init function for starting up the application
  angular.element(document).ready(init);

  function init() {
    // Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash === '#_=_') {
      if (window.history && history.pushState) {
        window.history.pushState('', document.title, window.location.pathname);
      } else {
        // Prevent scrolling by storing the page's current scroll offset
        var scroll = {
          top: document.body.scrollTop,
          left: document.body.scrollLeft
        };
        window.location.hash = '';
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scroll.top;
        document.body.scrollLeft = scroll.left;
      }
    }

    // Then init the app
    angular.bootstrap(document, [app.applicationModuleName]);
  }

}(ApplicationConfiguration));
