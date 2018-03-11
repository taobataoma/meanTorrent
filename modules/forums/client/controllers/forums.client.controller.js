(function () {
  'use strict';

  angular
    .module('forums')
    .controller('ForumsController', ForumsController);

  ForumsController.$inject = ['$scope', '$state', '$translate', 'Authentication', 'MeanTorrentConfig', 'ForumsService', 'localStorageService', '$filter', 'NotifycationService',
    'marked', 'ModalConfirmService', 'DebugConsoleService'];

  function ForumsController($scope, $state, $translate, Authentication, MeanTorrentConfig, ForumsService, localStorageService, $filter, NotifycationService,
                            marked, ModalConfirmService, mtDebug) {
    var vm = this;
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;
    vm.user = Authentication.user;

    /**
     * init
     */
    vm.init = function () {
      vm.last_leave_time = localStorageService.get('last_leave_time') || Date.now();

      // get forums list
      ForumsService.get({}, function (items) {
        mtDebug.info(items);
        vm.forums = items.forumsList;
        vm.forumsTopicsCount = items.forumsTopicsCount;
        vm.forumsRepliesCount = items.forumsRepliesCount;
      });
    };

    /**
     * getCatShowedStatus
     * @param cat
     * @returns {boolean}
     */
    vm.getCatShowedStatus = function (cat) {
      if (vm.forums) {
        var catForums = vm.forums.filter(function (fm) {
          return fm.category === cat.value;
        });

        if (catForums.length === 0) {
          return false;
        }

        if (vm.user.isOper) {
          return true;
        } else {
          if (cat.isVip) {
            if (vm.user.isVip) {
              return true;
            } else {
              return false;
            }
          } else if (cat.isOper) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        return true;
      }
    };

    /**
     * getForumShowedStatus
     * @param f
     * @returns {boolean}
     */
    vm.getForumShowedStatus = function (f) {
      if (vm.user.isOper) {
        return true;
      } else {
        if (f.vipOnly) {
          if (vm.user.isVip) {
            return true;
          } else {
            return false;
          }
        } else if (f.operOnly) {
          return false;
        } else {
          return true;
        }
      }
    };

    /**
     * getForumDesc
     * @param f: forum
     * @returns {*}
     */
    vm.getForumDesc = function (f) {
      if (f) {
        return marked(f.desc, {sanitize: true});
      }
    };

    /**
     * hasNewReply
     * @param t
     * @returns {boolean}
     */
    vm.hasNewReply = function (t) {
      if (t && t.lastReplyAt) {
        var t_reply = moment.utc(t.lastReplyAt).valueOf();
        var t_leave = moment.utc(vm.last_leave_time).valueOf();

        return t_reply > t_leave;
      } else {
        return false;
      }
    };

    vm.getTodayNewCount = function (f) {
      if (f) {
        var n_topic = getNewTopic(f);
        var n_reply = getNewReply(f);
        if (n_topic === 0 && n_reply === 0) {
          return undefined;
        } else if (n_topic === 0 && n_reply !== 0) {
          return $translate.instant('FORUMS.TODAY_NEW_COUNT_REPLY', {reply: n_reply});
        } else if (n_topic !== 0 && n_reply === 0) {
          return $translate.instant('FORUMS.TODAY_NEW_COUNT_TOPIC', {topic: n_topic});
        } else {
          return $translate.instant('FORUMS.TODAY_NEW_COUNT_ALL', {topic: n_topic, reply: n_reply});
        }
      } else {
        return undefined;
      }

      function getNewTopic(f) {
        var c = 0;
        angular.forEach(vm.forumsTopicsCount, function (tc) {
          if (tc._id === f._id) {
            c = c + tc.count;
          }
        });

        return c;
      }

      function getNewReply(f) {
        var c = 0;
        angular.forEach(vm.forumsRepliesCount, function (rc) {
          if (rc._id === f._id) {
            c = c + rc.count;
          }
        });

        return c;
      }
    };

  }
}());
