(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$translate', 'TorrentsService', 'Notification', 'TMDBConfig'];

  function HomeController($scope, $translate, TorrentsService, Notification, TMDBConfig) {
    var vm = this;
    vm.tmdbConfig = TMDBConfig.tmdbConfig;
    vm.movieTopList = undefined;

    vm.info_is_ready = false;
    //$translate.use('en');

    vm.COMING = 'coming soon...';

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

    vm.getTopInfo = function () {
      vm.getMovieTopInfo();
    };

    vm.getMovieTopInfo = function () {
      vm.moviesInfo = TorrentsService.query({
        limit: 8
      }, function (items) {
        vm.movieTopList = items;
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TOP_MOVIE_INFO_ERROR')
        });
      });
    };
  }
}());
