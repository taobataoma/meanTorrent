(function () {
  'use strict';

  angular
    .module('collections')
    .controller('CollectionItemController', CollectionItemController);

  CollectionItemController.$inject = ['$scope', '$state', '$translate', 'MeanTorrentConfig', 'CollectionsService', 'NotifycationService', 'DownloadService',
    'DebugConsoleService', 'TorrentGetInfoServices', 'Authentication', 'ResourcesTagsServices', 'ModalConfirmService', 'localStorageService',
    '$compile', 'marked', '$window'];

  function CollectionItemController($scope, $state, $translate, MeanTorrentConfig, CollectionsService, NotifycationService, DownloadService,
                                    mtDebug, TorrentGetInfoServices, Authentication, ResourcesTagsServices, ModalConfirmService, localStorageService,
                                    $compile, marked, $window) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = Authentication.user;
    vm.RTS = ResourcesTagsServices;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.torrentRLevels = MeanTorrentConfig.meanTorrentConfig.torrentRecommendLevel;

    vm.searchTags = [];
    vm.release = [];

    /**
     * getCollection
     */
    vm.getCollection = function () {
      CollectionsService.get({
        collectionId: $state.params.collectionId
      }, function (data) {
        vm.collection = data;

        $('.backdrop').css('backgroundImage', 'url("' + vm.tmdbConfig.backdropImgBaseUrl + vm.collection.backdrop_path + '")');

        //count ave vote
        var total = 0;
        var count = 0;
        var total_users = 0;
        angular.forEach(vm.collection.torrents, function (t) {
          total += t.resource_detail_info.vote_average;
          count += 1;
          total_users += t.resource_detail_info.vote_count;

          vm.release.push(parseInt(t.resource_detail_info.release_date, 10));
        });

        vm.collection.vote_count = total_users;
        vm.collection.vote_average = Math.floor((total / count) * 10) / 10;

        mtDebug.info(vm.collection);
        mtDebug.info(vm.release);
      });

    };

    /**
     * getMinMaxRelease
     * @param c
     * @returns {{min: *, max: *}}
     */
    vm.getMinMaxRelease = function () {
      return {
        min: vm.release.length > 0 ? Math.min.apply(null, vm.release) : '',
        max: vm.release.length > 0 ? Math.max.apply(null, vm.release) : ''
      };
    };

    /**
     * getCollectionOverviewContent
     * @param m
     * @returns {*}
     */
    vm.getCollectionOverviewContent = function (c) {
      return c ? marked(c.overview, {sanitize: true}) : '';
    };

    /**
     * beginRemoveCollection
     * @param m
     */
    vm.beginRemoveCollection = function (c) {
      var modalOptions = {
        closeButtonText: $translate.instant('ABOUT.DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('ABOUT.DELETE_CONFIRM_OK'),
        headerText: $translate.instant('ABOUT.DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('COLLECTIONS.DELETE_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          c.$remove(function (res) {
            NotifycationService.showSuccessNotify('COLLECTIONS.DELETE_SUCCESSFULLY');
            $state.go('collections.list');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'COLLECTIONS.DELETE_FAILED');
          });
        });
    };

    /**
     * beginEditCollectionOverview
     * @param m
     */
    vm.beginEditCollectionOverview = function (c) {
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
            vm.collection.overview = e.getContent();
            vm.collection.$update(function (res) {
              vm.collection = res;
              mtDebug.info(res);
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
          e.setContent(c.overview);

          var elei = $('#' + e.$editor.attr('id') + ' .md-input');
          mtDebug.info(elei);
          angular.element(elei).css('height', '200px');
          angular.element(elei).css('color', '#333');

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
          $compile(ele.contents())($scope);
        },
        onPreview: function (e) {
          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
          ele.css('display', 'none');
        },
        onPreviewEnd: function (e) {
          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
          ele.css('display', 'block');
        }
      });
    };

    /**
     * vm.setRecommendLevel
     */
    vm.setRecommendLevel = function (item, rl) {
      CollectionsService.setRecommendLevel({
        _id: item._id,
        rlevel: rl.value
      }, function (res) {
        vm.collection = res;
        NotifycationService.showSuccessNotify('COLLECTIONS.SETRLEVEL_SUCCESSFULLY');
      }, function (res) {
        NotifycationService.showSuccessNotify('COLLECTIONS.SETRLEVEL_ERROR');
      });
    };

    /**
     * removeFromCollections
     * @param item
     */
    vm.removeFromCollections = function (item) {
      var modalOptions = {
        closeButtonText: $translate.instant('COLLECTIONS.REMOVE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('COLLECTIONS.REMOVE_CONFIRM_OK'),
        headerText: $translate.instant('COLLECTIONS.REMOVE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('COLLECTIONS.REMOVE_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          CollectionsService.removeFromCollection({
            collectionId: vm.collection._id,
            torrentId: item._id
          }, function (res) {
            mtDebug.info(res);
            vm.collection = res;
            NotifycationService.showSuccessNotify('COLLECTIONS.REMOVE_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'COLLECTIONS.REMOVE_FAILED');
          });
        });
    };
  }
}());
