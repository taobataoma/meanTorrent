(function () {
  'use strict';

  angular
    .module('torrents')
    .controller('TorrentsController', TorrentsController);

  TorrentsController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'Notification', 'TorrentsService', 'TMDBConfig',
    'ResourcesTagsConfig'];

  function TorrentsController($scope, $state, $translate, Authentication, Notification, TorrentsService, TMDBConfig, ResourcesTagsConfig) {
    var vm = this;
    vm.user = Authentication.user;
    vm.tmdbConfig = TMDBConfig.tmdbConfig;
    vm.resourcesTags = ResourcesTagsConfig.resourcesTags;

    vm.topNumber = 6;
    vm.pageNumber = 50;

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $state.go('authentication.signin');
    }

    vm.getMovieTopInfo = function () {
      TorrentsService.query({
        limit: vm.topNumber
      }, function (items) {
        vm.movieTopInfo = items;
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('TOP_MOVIE_INFO_ERROR')
        });
      });
    };

    vm.getMoviePageInfo = function (p) {
      TorrentsService.query({
        skip: (p - 1) * vm.pageNumber + vm.topNumber,
        limit: p * vm.pageNumber
      }, function (items) {
        vm.moviesPageInfo = items;
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('MOVIE_PAGE_INFO_ERROR')
        });
      });

    };
  }
}());
