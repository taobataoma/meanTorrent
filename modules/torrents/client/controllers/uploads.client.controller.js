(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsUploadsController', TorrentsUploadsController);

  TorrentsUploadsController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', 'AnnounceConfig', 'Upload', 'Notification',
    'TorrentsService'];

  function TorrentsUploadsController($scope, $state, $translate, $timeout, Authentication, AnnounceConfig, Upload, Notification,
                                     TorrentsService) {
    var vm = this;
    vm.announce = AnnounceConfig.announce;
    vm.rule_items = [];
    vm.movieinfoarray = [];
    vm.user = Authentication.user;
    vm.progress = 0;
    vm.successfully = undefined;
    vm.tmbd_info_ok = undefined;

    for (var i = 0; i < $translate.instant('UPLOADS_RULES_COUNT'); i++) {
      vm.rule_items[i] = i;
    }

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    //******************** begin upload torrent file *********************
    vm.upload = function (dataUrl) {
      console.log(dataUrl);

      if (dataUrl === null || dataUrl === undefined) {
        vm.fileSelected = false;
        // Show success message
        Notification.info({
          message: '<i class="glyphicon glyphicon-info-sign"></i> ' + $translate.instant('TORRENTS_NO_FILE_SELECTED')
        });
        return;
      }

      Upload.upload({
        url: '/api/torrents/upload',
        data: {
          newTorrentFile: dataUrl
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response);
        });
      }, function (response) {
        console.log(response);
        if (response.status > 0) onErrorItem(response);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    function onSuccessItem(response) {
      vm.fileSelected = false;
      vm.successfully = true;
      // Show success message
      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TORRENTS_UPLOAD_SUCCESSFULLY')
      });
    }

    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.successfully = false;
      vm.tFile = undefined;
      // Show error message
      Notification.error({
        message: response.data,
        title: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TORRENTS_UPLOAD_FAILED')
      });
    }

    //************** begin get tmdb info ***********************************
    vm.onTextClick = function ($event) {
      $event.target.select();
    };

    vm.getInfo = function (tmdbid) {
      console.log(tmdbid);
      if (tmdbid === null || tmdbid === undefined) {
        Notification.info({
          message: '<i class="glyphicon glyphicon-info-sign"></i> ' + $translate.instant('TMDB_ID_REQUIRED')
        });
        angular.element('#tmdbid').focus();
        return;
      }

      TorrentsService.getTMDBInfo({
        tmdbid: tmdbid,
        language: 'zh'
      }, function (res) {
        vm.tmbd_info_ok = true;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TMDB_ID_OK')
        });

        console.log(res);
        vm.movieinfo = res;
        for (var item in res) {
          if(item[0]!=='$' && item!=='toJSON') {
            var value = res[item];
            var nv = {
              key: item,
              value: value
            };
            vm.movieinfoarray.push(nv);
          }
        }
        console.log(vm.movieinfo);
      }, function (err) {
        vm.tmbd_info_ok = false;
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TMDB_ID_ERROR')
        });
        angular.element('#tmdbid').focus();
      });
    };

  }
}());
