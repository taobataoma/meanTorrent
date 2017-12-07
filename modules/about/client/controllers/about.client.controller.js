(function () {
  'use strict';

  angular
    .module('about')
    .controller('AboutController', AboutController);

  AboutController.$inject = ['$scope', '$state', 'getStorageLangService', 'MeanTorrentConfig', 'AdminService', 'MakerGroupService', 'DebugConsoleService', 'marked',
    'localStorageService', '$translate', '$compile', 'Authentication', 'DownloadService', 'TorrentGetInfoServices', 'ResourcesTagsServices',
    'uibButtonConfig', '$window', '$timeout', 'TorrentsService', 'ModalConfirmService', 'NotifycationService'];

  function AboutController($scope, $state, getStorageLangService, MeanTorrentConfig, AdminService, MakerGroupService, mtDebug, marked,
                           localStorageService, $translate, $compile, Authentication, DownloadService, TorrentGetInfoServices, ResourcesTagsServices,
                           uibButtonConfig, $window, $timeout, TorrentsService, ModalConfirmService, NotifycationService) {
    var vm = this;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.user = Authentication.user;
    vm.RTS = ResourcesTagsServices;
    vm.lang = getStorageLangService.getLang();
    vm.blackListConfig = MeanTorrentConfig.meanTorrentConfig.clientBlackList;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.torrentType = MeanTorrentConfig.meanTorrentConfig.torrentType;

    vm.groupTorrentType = localStorageService.get('maker_last_selected_type') || 'movie';
    vm.searchTags = [];

    uibButtonConfig.activeClass = 'btn-success';

    vm.addMemberPopover = {
      title: 'ABOUT.ADD_MEMBER_TITLE',
      templateUrl: 'add-member.html',
      isOpen: false
    };

    /**
     * buildPager
     */
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = vm.itemsPerPageConfig.makeGroupTorrentsPerPage;
      vm.currentPage = 1;

      vm.tooltipMsg = 'ABOUT.MAKER_TORRENTS_IS_LOADING';
      vm.figureOutItemsToDisplay();
    };

    /**
     * figureOutItemsToDisplay
     * @param callback
     */
    vm.figureOutItemsToDisplay = function (callback) {
      vm.getMakerTorrents(vm.currentPage, function (items) {
        vm.filterLength = items.total;
        vm.pagedItems = items.rows;

        if (vm.pagedItems.length === 0) {
          vm.tooltipMsg = 'ABOUT.MAKER_TORRENTS_IS_EMPTY';
        } else {
          vm.tooltipMsg = undefined;
        }
        if (callback) callback();
      });
    };

    /**
     * onTypeBtnClick
     */
    vm.onTypeBtnClick = function () {
      localStorageService.set('maker_last_selected_type', vm.groupTorrentType);
    };

    /**
     * orderByVote
     */
    vm.orderByVote = function () {
      vm.sortSLF = undefined;
      vm.sortSize = undefined;
      vm.sortLife = undefined;

      if (vm.sortVote === undefined) {
        vm.sortVote = '-';
        vm.sort = {'resource_detail_info.vote_average': -1};
      } else if (vm.sortVote === '-') {
        vm.sortVote = undefined;
        vm.sort = undefined;
      }

      vm.buildPager();
    };

    /**
     * orderBySize
     */
    vm.orderBySize = function () {
      vm.sortSLF = undefined;
      vm.sortVote = undefined;
      vm.sortLife = undefined;

      if (vm.sortSize === undefined) {
        vm.sortSize = '-';
        vm.sort = {'torrent_size': -1};
      } else if (vm.sortSize === '-') {
        vm.sortSize = undefined;
        vm.sort = undefined;
      }

      vm.buildPager();
    };

    /**
     * orderByLife
     */
    vm.orderByLife = function () {
      vm.sortSLF = undefined;
      vm.sortVote = undefined;
      vm.sortSize = undefined;

      if (vm.sortLife === undefined) {
        vm.sortLife = '-';
        vm.sort = {'createdat': 1};
      } else if (vm.sortLife === '-') {
        vm.sortLife = undefined;
        vm.sort = undefined;
      }

      vm.buildPager();
    };

    /**
     * orderBySLF
     */
    vm.orderBySLF = function () {
      vm.sortVote = undefined;
      vm.sortSize = undefined;
      vm.sortLife = undefined;

      if (vm.sortSLF === undefined) {
        vm.sortSLF = '-S';
        vm.sort = {torrent_seeds: -1};
      } else if (vm.sortSLF === '-S') {
        vm.sortSLF = '-L';
        vm.sort = {torrent_leechers: -1};
      } else if (vm.sortSLF === '-L') {
        vm.sortSLF = '-F';
        vm.sort = {torrent_finished: -1};
      } else if (vm.sortSLF === '-F') {
        vm.sortSLF = undefined;
        vm.sort = undefined;
      }

      vm.buildPager();
    };

    /**
     *
     * @returns {string|Object}
     */
    vm.getOrderTableHead = function () {
      var res = $translate.instant('TABLE_FIELDS.SEEDS_LEECHERS_FINISHED');
      switch (vm.sortSLF) {
        case '-S':
          res = $translate.instant('TABLE_FIELDS.SORT_S');
          res += '<i class="fa fa-caret-down text-info"></i>';
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_L');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_F');
          break;
        case '+S':
          res = $translate.instant('TABLE_FIELDS.SORT_S');
          res += '<i class="fa fa-caret-up text-info"></i>';
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_L');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_F');
          break;
        case '-L':
          res = $translate.instant('TABLE_FIELDS.SORT_S');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_L');
          res += '<i class="fa fa-caret-down text-info"></i>';
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_F');
          break;
        case '+L':
          res = $translate.instant('TABLE_FIELDS.SORT_S');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_L');
          res += '<i class="fa fa-caret-up text-info"></i>';
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_F');
          break;
        case '-F':
          res = $translate.instant('TABLE_FIELDS.SORT_S');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_L');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_F');
          res += '<i class="fa fa-caret-down text-info"></i>';
          break;
        case '+F':
          res = $translate.instant('TABLE_FIELDS.SORT_S');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_L');
          res += '/' + $translate.instant('TABLE_FIELDS.SORT_F');
          res += '<i class="fa fa-caret-up text-info"></i>';
          break;
      }
      return res;
    };

    /**
     * getMakerTorrents
     * @param p
     * @param callback
     */
    vm.getMakerTorrents = function (p, callback) {
      TorrentsService.get({
        skip: (p - 1) * vm.itemsPerPage,
        limit: vm.itemsPerPage,
        sort: vm.sort,
        torrent_type: vm.groupTorrentType,
        torrent_status: 'reviewed',
        maker: vm.maker._id,
        torrent_vip: false,
        keys: vm.search
      }, function (data) {
        mtDebug.info(data);
        callback(data);
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('ABOUT.MAKER_TORRENTS_LIST_ERROR')
        });
      });
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
     * getMaker
     */
    vm.getMaker = function () {
      MakerGroupService.get({
        makerId: $state.params.makerId
      }, function (data) {
        vm.maker = data;
        vm.rating_vote = vm.maker.vote_average;

        mtDebug.info(data);

        vm.buildPager();
      });

    };

    /**
     * isOwner
     * @param m, maker
     * @returns {boolean}
     */
    vm.isOwner = function (m) {
      if (m) {
        if (m.user._id === vm.user._id) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    /**
     * isFounder
     * @param u
     * @param m
     * @returns {boolean}
     */
    vm.isFounder = function (u, m) {
      if (m && u) {
        if (m.user._id === u._id) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    /**
     * getMakerDescContent
     * @param m
     * @returns {*}
     */
    vm.getMakerDescContent = function (m) {
      return m ? marked(m.desc, {sanitize: true}) : '';
    };

    /**
     * addMember
     */
    vm.addMember = function () {
      MakerGroupService.addMember({
        _id: vm.maker._id,
        _username: vm.addMemberPopover.username
      }, function (res) {
        vm.maker = res;
        NotifycationService.showSuccessNotify('ABOUT.ADD_MEMBER_SUCCESSFULLY');
        vm.addMemberPopover.isOpen = false;
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'ABOUT.ADD_MEMBER_FAILED');
        vm.addMemberPopover.isOpen = false;
      });
    };

    /**
     * removeMember
     * @param f forum
     * @param m moderator
     */
    vm.removeMember = function (m, u) {
      var modalOptions = {
        closeButtonText: $translate.instant('ABOUT.DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('ABOUT.DELETE_CONFIRM_OK'),
        headerText: $translate.instant('ABOUT.DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('ABOUT.DELETE_MEMBER_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          MakerGroupService.removeMember({
            _id: m._id,
            _username: u.username
          }, function (res) {
            vm.maker = res;
            NotifycationService.showSuccessNotify('ABOUT.REMOVE_MEMBER_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'ABOUT.REMOVE_MEMBER_FAILED');
          });
        });
    };

    /**
     * beginEditMakerDesc
     * @param m
     */
    vm.beginEditMakerDesc = function (m) {
      var el = $('#' + m._id);

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
            vm.maker.desc = e.getContent();
            vm.maker.$update(function (res) {
              vm.maker = res;
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
          e.setContent(m.desc);

          var elei = $('#' + e.$editor.attr('id') + ' .md-input');
          mtDebug.info(elei);
          angular.element(elei).css('height', '200px');
          angular.element(elei).css('color', '#333');

          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
          mtDebug.info(ele);

          angular.element(ele).addClass('text-right');
          angular.element(ele[0].childNodes[0]).addClass('btn-width-80');
          ele[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-default btn-width-80 margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
          cbtn.bind('click', function (evt) {
            e.setContent(m.desc);
            e.$options.hideable = true;
            e.blur();
          });
          ele.append(cbtn);
          $compile(ele.contents())($scope);
        }
      });
    };

    /**
     * beginRemoveMakerGroup
     * @param m
     */
    vm.beginRemoveMakerGroup = function (m) {
      var modalOptions = {
        closeButtonText: $translate.instant('ABOUT.DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('ABOUT.DELETE_CONFIRM_OK'),
        headerText: $translate.instant('ABOUT.DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('ABOUT.DELETE_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          m.$remove(function (res) {
            NotifycationService.showSuccessNotify('ABOUT.DELETE_SUCCESSFULLY');
            $state.go('about.maker');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'ABOUT.DELETE_FAILED');
          });
        });
    };

    /**
     * ratingMaker
     * @param item
     */
    vm.ratingMaker = function (item) {
      item.$rating({
        vote: vm.rating_vote
      }, function (res) {
        vm.maker = res;
        vm.rating_vote = vm.maker.vote_average;

        NotifycationService.showSuccessNotify('ABOUT.RATING_SUCCESSFULLY');
      }, function (res) {
        vm.rating_vote = vm.maker.vote_average;
        NotifycationService.showErrorNotify(res.data.message, 'ABOUT.RATING_FAILED');
      });
    };

    /**
     * getOperList
     */
    vm.getOperList = function () {
      AdminService.get({
        isOper: true,
        isAdmin: true
      }, function (data) {
        vm.operList = data.rows;
      });
    };

    /**
     * getMakerList
     */
    vm.getMakerList = function () {
      MakerGroupService.query(function (data) {
        vm.makerList = data;
        mtDebug.info(data);
      });
    };

    /**
     * spinCog
     */
    vm.spinCog = function (evt, id) {
      var e = $('#cog_' + id);
      e.addClass('fa-spin');
    };

    /**
     * stopCog
     */
    vm.stopCog = function (evt, id) {
      var e = $('#cog_' + id);
      e.removeClass('fa-spin');
    };
  }
}());
