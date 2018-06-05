(function () {
  'use strict';

  angular
    .module('dataLogs')
    .controller('DataCenterController', DataCenterController);

  DataCenterController.$inject = ['$scope', '$state', '$translate', '$timeout', 'Authentication', '$window', 'MeanTorrentConfig', 'NotifycationService',
    'UserDaysLogsService', 'UserMonthsLogsService', '$rootScope', 'moment', 'DebugConsoleService', '$filter'];

  function DataCenterController($scope, $state, $translate, $timeout, Authentication, $window, MeanTorrentConfig, NotifycationService,
                                UserDaysLogsService, UserMonthsLogsService, $rootScope, moment, mtDebug, $filter) {
    var vm = this;
    vm.user = Authentication.user;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.announceConfig = MeanTorrentConfig.meanTorrentConfig.announce;

    /**
     * getUserDaysLogs
     */
    vm.getUserDaysLogs = function () {
      UserDaysLogsService.query({
        userId: vm.user._id
      }, function (items) {
        vm.userDaysLogsData = getUserDaysLogsData(items);
        mtDebug.info(vm.userDaysLogsData);
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'DATA_CENTER.GET_USER_LOGS_ERROR');
      });
    };

    /**
     * getUserDaysLogsData
     * @param items
     * @returns {{labels: Array, series: {score: Array, uploaded: Array, downloaded: Array}, data: {score: Array, uploaded: Array, downloaded: Array}}}
     */
    function getUserDaysLogsData(items) {
      var logsData = {
        labels: [],
        series: {
          score: [],
          uploaded: [],
          downloaded: []
        },
        data: {
          score: [],
          uploaded: [],
          downloaded: []
        }
      };

      //labels
      //labels
      for (var i = vm.announceConfig.userDaysLogDays - 1; i >= 0; i--) {
        logsData.labels.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
      }

      //series
      logsData.series.score.push($translate.instant('DATA_CENTER.SERIES_SCORE'));
      logsData.series.uploaded.push($translate.instant('DATA_CENTER.SERIES_UPLOADED'));
      logsData.series.downloaded.push($translate.instant('DATA_CENTER.SERIES_DOWNLOADED'));

      //data
      angular.forEach(logsData.labels, function (lab) {
        var labItems = $filter('where')(items, {ymd: lab});

        var labScore = labItems.length > 0 ? labItems.map(function (x) {
          return x.score;
        }).reduce(function (a, b) {
          return a + b;
        }) : 0;
        logsData.data.score.push(labScore);

        var labUploaded = labItems.length > 0 ? labItems.map(function (x) {
          return x.uploaded;
        }).reduce(function (a, b) {
          return a + b;
        }) : 0;
        logsData.data.uploaded.push(Math.round(labUploaded / (1024 * 1024 * 1024) * 100) / 100);

        var labDownloaded = labItems.length > 0 ? labItems.map(function (x) {
          return x.downloaded;
        }).reduce(function (a, b) {
          return a + b;
        }) : 0;
        logsData.data.downloaded.push(Math.round(labDownloaded / (1024 * 1024 * 1024) * 100) / 100);
      });

      return logsData;
    }

    /**
     * getUserMonthsLogs
     */
    vm.getUserMonthsLogs = function () {
      UserMonthsLogsService.query({
        userId: vm.user._id
      }, function (items) {
        vm.userMonthsLogsData = getUserMonthsLogsData(items);
        mtDebug.info(vm.userMonthsLogsData);
      }, function (res) {
        NotifycationService.showErrorNotify(res.data.message, 'DATA_CENTER.GET_USER_LOGS_ERROR');
      });
    };

    /**
     * getUserMonthsLogsData
     * @param items
     * @returns {{labels: Array, series: {score: Array, uploaded: Array, downloaded: Array}, data: {score: Array, uploaded: Array, downloaded: Array}}}
     */
    function getUserMonthsLogsData(items) {
      var logsData = {
        labels: [],
        series: {
          score: [],
          uploaded: [],
          downloaded: []
        },
        data: {
          score: [],
          uploaded: [],
          downloaded: []
        }
      };

      //labels
      for (var i = vm.announceConfig.userMonthsLogMonths - 1; i >= 0; i--) {
        logsData.labels.push(moment().subtract(i, 'months').format('YYYY-MM'));
      }

      //series
      logsData.series.score.push($translate.instant('DATA_CENTER.SERIES_SCORE'));
      logsData.series.uploaded.push($translate.instant('DATA_CENTER.SERIES_UPLOADED'));
      logsData.series.downloaded.push($translate.instant('DATA_CENTER.SERIES_DOWNLOADED'));

      //data
      angular.forEach(logsData.labels, function (lab) {
        var labItems = $filter('where')(items, {ym: lab});

        var labScore = labItems.length > 0 ? labItems.map(function (x) {
          return x.score;
        }).reduce(function (a, b) {
          return a + b;
        }) : 0;
        logsData.data.score.push(labScore);

        var labUploaded = labItems.length > 0 ? labItems.map(function (x) {
          return x.uploaded;
        }).reduce(function (a, b) {
          return a + b;
        }) : 0;
        logsData.data.uploaded.push(Math.round(labUploaded / (1024 * 1024 * 1024) * 100) / 100);

        var labDownloaded = labItems.length > 0 ? labItems.map(function (x) {
          return x.downloaded;
        }).reduce(function (a, b) {
          return a + b;
        }) : 0;
        logsData.data.downloaded.push(Math.round(labDownloaded / (1024 * 1024 * 1024) * 100) / 100);
      });

      return logsData;
    }

  }
}());
