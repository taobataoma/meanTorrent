(function () {
  'use strict';

  angular
    .module('about')
    .controller('AboutController', AboutController);

  AboutController.$inject = ['$scope', '$state', 'getStorageLangService', 'MeanTorrentConfig', 'AdminService', 'MakerGroupService', 'DebugConsoleService', 'marked',
    'localStorageService', '$translate', '$compile', 'Authentication'];

  function AboutController($scope, $state, getStorageLangService, MeanTorrentConfig, AdminService, MakerGroupService, mtDebug, marked,
                           localStorageService, $translate, $compile, Authentication) {
    var vm = this;
    vm.user = Authentication.user;
    vm.lang = getStorageLangService.getLang();
    vm.blackListConfig = MeanTorrentConfig.meanTorrentConfig.clientBlackList;
    vm.appConfig = MeanTorrentConfig.meanTorrentConfig.app;
    vm.announce = MeanTorrentConfig.meanTorrentConfig.announce;

    vm.init = function () {

    };

    /**
     * getMaker
     */
    vm.getMaker = function () {
      MakerGroupService.get({
        makerId: $state.params.makerId
      }, function (data) {
        vm.maker = data;
        mtDebug.info(data);
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
     * getMakerDescContent
     * @param m
     * @returns {*}
     */
    vm.getMakerDescContent = function (m) {
      return m ? marked(m.desc, {sanitize: true}) : 'NULL';
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
