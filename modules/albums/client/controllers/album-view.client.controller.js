(function () {
  'use strict';

  angular
    .module('albums')
    .controller('AlbumItemController', AlbumItemController);

  AlbumItemController.$inject = ['$scope', '$state', '$translate', 'MeanTorrentConfig', 'AlbumsService', 'NotifycationService', 'DownloadService',
    'DebugConsoleService', 'TorrentGetInfoServices', 'Authentication', 'ResourcesTagsServices', 'ModalConfirmService', 'localStorageService',
    '$compile', 'marked', '$timeout'];

  function AlbumItemController($scope, $state, $translate, MeanTorrentConfig, AlbumsService, NotifycationService, DownloadService,
                               mtDebug, TorrentGetInfoServices, Authentication, ResourcesTagsServices, ModalConfirmService, localStorageService,
                               $compile, marked, $timeout) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = Authentication.user;
    vm.RTS = ResourcesTagsServices;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.torrentRLevels = MeanTorrentConfig.meanTorrentConfig.torrentRecommendLevel;
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;

    vm.searchTags = [];
    vm.release = [];

    /**
     * getAlbum
     */
    vm.getAlbum = function () {
      AlbumsService.get({
        albumId: $state.params.albumId
      }, function (data) {
        vm.album = data;
        mtDebug.info(data);
        vm.buildPager();
        $('.backdrop').css('backgroundImage', 'url("' + vm.getAlbumBackdropImage(vm.album) + '")');
      });
    };

    /**
     * onKeysKeyDown
     * @param evt
     */
    vm.onKeysKeyDown = function (evt) {
      if (evt.keyCode === 13) {
        vm.buildPager();
      }
    };

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.albumTorrentsPerPage;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.filteredItems = vm.album.torrents.reverse();
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);

      if (callback) callback();
    };

    /**
     * pageChanged
     */
    vm.pageChanged = function () {
      var element = angular.element('#top_of_torrent_list');

      $('.tb-v-middle').fadeTo(100, 0.01, function () {
        vm.figureOutItemsToDisplay(function () {
          $timeout(function () {
            $('.tb-v-middle').fadeTo(400, 1, function () {
              //window.scrollTo(0, element[0].offsetTop - 60);
              $('html,body').animate({scrollTop: element[0].offsetTop - 60}, 200);
            });
          }, 100);
        });
      });
    };

    /**
     * getAlbumBackdropImage
     * @param item
     * @returns {string}
     */
    vm.getAlbumBackdropImage = function (item) {
      var result = null;

      if (item.backdrop_path) {
        result = vm.tmdbConfig.backdropImgBaseUrl + item.backdrop_path;
      } else if (item.cover) {
        result = '/modules/torrents/client/uploads/cover/' + item.cover;
      }
      return result;
    };

    /**
     * getAlbumOverviewContent
     * @param m
     * @returns {*}
     */
    vm.getAlbumOverviewContent = function (c) {
      return c ? marked(c.overview, {sanitize: true}) : '';
    };

    /**
     * beginRemoveAlbum
     * @param m
     */
    vm.beginRemoveAlbum = function (c) {
      var modalOptions = {
        closeButtonText: $translate.instant('ABOUT.DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('ABOUT.DELETE_CONFIRM_OK'),
        headerText: $translate.instant('ABOUT.DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('ALBUMS.DELETE_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          c.$remove(function (res) {
            NotifycationService.showSuccessNotify('ALBUMS.DELETE_SUCCESSFULLY');
            $state.go('albums.list');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'ALBUMS.DELETE_FAILED');
          });
        });
    };

    /**
     * beginEditAlbumOverview
     * @param m
     */
    vm.beginEditAlbumOverview = function (c) {
      var el = $('#' + c._id);

      el.markdown({
        autofocus: true,
        savable: true,
        hideable: true,
        iconlibrary: 'fa',
        resize: 'vertical',
        language: localStorageService.get('storage_user_lang'),
        fullscreen: {enable: false},
        onSave: function (e) {
          if (e.isDirty()) {
            vm.album.overview = e.getContent();
            vm.album.$update(function (res) {
              vm.album = res;
              NotifycationService.showSuccessNotify('ALBUMS.EDIT_OVERVIEW_SUCCESSFULLY');
            }, function (res) {
              NotifycationService.showErrorNotify(res.data.message, 'ALBUMS.EDIT_OVERVIEW_FAILED');
            });

            e.$options.hideable = true;
            e.blur();
          } else {
            e.$options.hideable = true;
            e.blur();
          }
        },
        onChange: function (e) {
          e.$options.hideable = false;
        },
        onShow: function (e) {
          $('#' + e.$editor.attr('id') + ' .md-input').textcomplete([
            { // emoji strategy
              match: /\B:([\-+\w]*)$/,
              search: function (term, callback) {
                callback($.map(window.emojies, function (emoji) {
                  return emoji.indexOf(term) === 0 ? emoji : null;
                }));
              },
              template: function (value) {
                return '<img class="ac-emoji" src="/graphics/emojis/' + value + '.png" />' + '<span class="ac-emoji-text">' + value + '</span>';
              },
              replace: function (value) {
                return ':' + value + ': ';
              },
              index: 1
            }
          ]);

          e.setContent(c.overview);
          $('#' + e.$editor.attr('id') + ' .md-input').attr('maxlength', vm.inputLengthConfig.albumsOverviewLength);

          var elei = $('#' + e.$editor.attr('id') + ' .md-input');
          angular.element(elei).css('height', '200px');
          angular.element(elei).css('color', '#333');

          var inputInfo = angular.element('<span></span>');
          inputInfo.addClass('pull-right');
          inputInfo.addClass('input-length');
          inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.albumsOverviewLength);
          $('#' + e.$editor.attr('id') + ' .md-header').append(inputInfo);
          $('#' + e.$editor.attr('id') + ' .md-input').on('input propertychange', function (evt) {
            inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.albumsOverviewLength);
          });

          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
          angular.element(ele).addClass('text-right');
          angular.element(ele[0].childNodes[0]).addClass('btn-width-80');
          ele[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-default btn-width-80 margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
          cbtn.bind('click', function (evt) {
            e.setContent(c.overview);
            e.$options.hideable = true;
            e.blur();
          });
          ele.append(cbtn);
          $compile(e.$editor.contents())($scope);
        },
        onPreview: function (e) {
          $('#' + e.$editor.attr('id') + ' .md-footer').css('display', 'none');
        },
        onPreviewEnd: function (e) {
          $('#' + e.$editor.attr('id') + ' .md-footer').css('display', 'block');
        }
      });
    };

    /**
     * vm.setRecommendLevel
     */
    vm.setRecommendLevel = function (item, rl) {
      AlbumsService.setRecommendLevel({
        _id: item._id,
        rlevel: rl.value
      }, function (res) {
        vm.album = res;
        NotifycationService.showSuccessNotify('ALBUMS.SETRLEVEL_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showSuccessNotify('ALBUMS.SETRLEVEL_ERROR');
      });
    };

    /**
     * removeFromAlbum
     * @param item
     */
    vm.removeFromAlbum = function (item) {
      var modalOptions = {
        closeButtonText: $translate.instant('ALBUMS.REMOVE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('ALBUMS.REMOVE_CONFIRM_OK'),
        headerText: $translate.instant('ALBUMS.REMOVE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('ALBUMS.REMOVE_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          AlbumsService.removeFromAlbum({
            albumId: vm.album._id,
            torrentId: item._id
          }, function (res) {
            mtDebug.info(res);
            vm.album = res;
            NotifycationService.showSuccessNotify('AlbumsService.REMOVE_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'AlbumsService.REMOVE_FAILED');
          });
        });
    };

    /**
     * beginToggleHomeStatus
     * @param item
     */
    vm.beginToggleHomeStatus = function (item) {
      AlbumsService.toggleHomeItemStatus({
        _id: item._id
      }, function (res) {
        vm.album = res;
        NotifycationService.showSuccessNotify('ALBUMS.HOME_STATUS_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showSuccessNotify('ALBUMS.HOME_STATUS_ERROR');
      });
    };
  }
}());
