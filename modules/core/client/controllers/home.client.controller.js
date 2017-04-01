(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$translate', 'TorrentsService', 'Notification'];

  function HomeController($scope, $translate, TorrentsService, Notification) {
    var vm = this;

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
        $('.backdrop').css('backgroundImage', 'url(http://image.tmdb.org/t/p/w500' + res.backdrop_path + ')');
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TMDB_ID_ERROR')
        });
      });
    };
  }
}());
