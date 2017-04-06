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

    vm.searchTags = [];
    vm.searchKey = '';
    vm.currPageNumber = 1;
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

    vm.onRadioTagClicked = function (event, n) {
      var e = angular.element(event.currentTarget);

      if (e.hasClass('btn-success')) {
        e.removeClass('btn-success').addClass('btn-default');
        vm.searchTags.splice(vm.searchTags.indexOf(n), 1);
      } else {
        e.addClass('btn-success').removeClass('btn-default').siblings().removeClass('btn-success').addClass('btn-default');
        vm.searchTags.push(n);

        angular.forEach(e.siblings(), function (se) {
          if (vm.searchTags.indexOf(se.value) !== -1) {
            vm.searchTags.splice(vm.searchTags.indexOf(se.value), 1);
          }
        });
      }
      e.blur();
      vm.getMoviePageInfo(1);
    };

    vm.onCheckboxTagClicked = function (event, n) {
      var e = angular.element(event.currentTarget);

      if (e.hasClass('btn-success')) {
        vm.searchTags.push(n);
      } else {
        vm.searchTags.splice(vm.searchTags.indexOf(n), 1);
      }
      vm.getMoviePageInfo(1);
    };

    vm.onKeysKeyDown = function (evt) {
      if (evt.keyCode === 13) {
        vm.getMoviePageInfo(1);
      }
    };


    vm.getMoviePageInfo = function (p) {
      vm.currPageNumber = p;

      //if searchKey or searchTags has value, the skip=0
      var skip = vm.topNumber;
      if (vm.searchKey.trim().length > 0 || vm.searchTags.length > 0) {
        skip = 0;
      }

      TorrentsService.query({
        skip: (p - 1) * vm.pageNumber + skip,
        limit: p * vm.pageNumber,
        keys: vm.searchKey,
        torrent_status: 'reviewed',
        torrent_type: 'movie',
        //torrent_release: vm.releaseYear,
        torrent_tags: vm.searchTags
      }, function (items) {
        vm.moviePageInfo = items;
        console.log(items);
      }, function (err) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + $translate.instant('MOVIE_PAGE_INFO_ERROR')
        });
      });
    };

    vm.getTagTitle = function (tag) {
      var tmp = tag;
      var find = false;
      angular.forEach(vm.resourcesTags.movie.radio, function (item) {
        angular.forEach(item.value, function (sitem) {
          if (sitem.name === tag) {
            tmp = item.name;
            find = true;
          }
        });
      });

      if (!find) {
        angular.forEach(vm.resourcesTags.movie.checkbox, function (item) {
          angular.forEach(item.value, function (sitem) {
            if (sitem.name === tag) {
              tmp = item.name;
            }
          });
        });
      }
      return tmp;
    };

    vm.clearAllCondition = function () {
      vm.searchKey = '';
      vm.searchTags = [];
      $('.btn-tag').removeClass('btn-success').addClass('btn-default');

      vm.getMoviePageInfo(1);
    };
  }
}());
