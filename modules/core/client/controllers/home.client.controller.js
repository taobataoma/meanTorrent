(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'TorrentsService', 'Notification', 'MeanTorrentConfig', 'getStorageLangService'];

  function HomeController($scope, $state, $translate, Authentication, TorrentsService, Notification, MeanTorrentConfig, getStorageLangService) {
    var vm = this;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;

    vm.movieTopOne = undefined;
    vm.movieTopList = undefined;
    vm.movieNewList = undefined;
    vm.movieTopInfo = undefined;

    /**
     * If user is not signed in then redirect back signin
     */
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    /**
     * initTopOneInfo
     */
    vm.initTopOneInfo = function () {
      $('.backdrop').css('backgroundImage', 'url(' + vm.tmdbConfig.backdrop_img_base_url + vm.movieTopOne.torrent_backdrop_img + ')');

      //TorrentsService.getTMDBInfo({
      //  tmdbid: vm.movieTopOne.torrent_tmdb_id,
      //  language: getStorageLangService.getLang()
      //}, function (res) {
      //  vm.movieTopInfo = res;
      //});
    };

    /**
     * getTopInfo
     */
    vm.getTopInfo = function () {
      vm.getMovieTopInfo();
    };

    /**
     * getMovieTopInfo
     */
    vm.getMovieTopInfo = function () {
      vm.moviesInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'movie',
        limit: 9
      }, function (items) {
        vm.movieTopOne = items.rows[0];
        items.rows.splice(0, 1);
        vm.movieTopList = items.rows;

        vm.initTopOneInfo();
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TOP_MOVIE_INFO_ERROR')
        });
      });

      vm.moviesInfo = TorrentsService.get({
        torrent_status: 'reviewed',
        torrent_type: 'movie',
        newest: true,
        limit: 14
      }, function (items) {
        vm.movieNewList = items.rows;
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TOP_MOVIE_INFO_ERROR')
        });
      });
    };

    /**
     * openTorrentInfo
     * @param id
     */
    vm.openTorrentInfo = function (id) {
      var url = $state.href('torrents.view', {torrentId: id});
      window.open(url, '_blank');
    };
  }
}());
