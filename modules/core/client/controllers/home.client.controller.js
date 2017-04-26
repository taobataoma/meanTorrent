(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', '$translate', 'TorrentsService', 'Notification', 'MeanTorrentConfig'];

  function HomeController($scope, $state, $translate, TorrentsService, Notification, MeanTorrentConfig) {
    var vm = this;
    vm.tmdbConfig = MeanTorrentConfig.meanTorrentConfig.tmdbConfig;
    vm.movieTopList = undefined;

    vm.info_is_ready = false;
    //$translate.use('en');

    vm.COMING = 'coming soon...';

    /**
     * initInfo
     */
    vm.initInfo = function () {
      TorrentsService.getTMDBInfo({
        tmdbid: '329865',
        language: 'en'
      }, function (res) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + $translate.instant('TMDB_ID_OK')
        });

        vm.movieinfo = res;
        vm.info_is_ready = true;
        $('.backdrop').css('backgroundImage', 'url(' + vm.tmdbConfig.backdrop_img_base_url + res.backdrop_path + ')');
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TMDB_ID_ERROR')
        });
      });
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
      vm.moviesInfo = TorrentsService.query({
        limit: 16
      }, function (items) {
        vm.movieTopList = items;
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
