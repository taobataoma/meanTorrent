(function () {
  'use strict';

  angular
    .module('requests')
    .controller('RequestsViewController', RequestsViewController);

  RequestsViewController.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'Authentication', 'RequestsService', 'localStorageService', 'MeanTorrentConfig', 'DebugConsoleService',
    'NotifycationService', '$stateParams', 'marked', 'ModalConfirmService', '$compile', 'DownloadService', 'TorrentGetInfoServices', 'ResourcesTagsServices'];

  function RequestsViewController($scope, $rootScope, $state, $timeout, $translate, Authentication, RequestsService, localStorageService, MeanTorrentConfig, mtDebug,
                                  NotifycationService, $stateParams, marked, ModalConfirmService, $compile, DownloadService, TorrentGetInfoServices, ResourcesTagsServices) {
    var vm = this;
    vm.user = Authentication.user;
    vm.itemsPerPageConfig = MeanTorrentConfig.meanTorrentConfig.itemsPerPage;
    vm.requestsConfig = MeanTorrentConfig.meanTorrentConfig.requests;
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;
    vm.DLS = DownloadService;
    vm.TGI = TorrentGetInfoServices;
    vm.RTS = ResourcesTagsServices;

    vm.searchTags = [];

    /**
     * getRequestsDesc
     * @returns {*}
     */
    vm.getRequestsDesc = function () {
      var ts = $translate.instant('REQUESTS.DESC_VIEW', {
        days: vm.requestsConfig.requestExpires / (60 * 60 * 1000 * 24)
      });

      return marked(ts, {sanitize: true});
    };

    /**
     * getRequestDescContent
     * @param q
     * @returns {*}
     */
    vm.getRequestDescContent = function (q) {
      return q ? marked(q.desc, {sanitize: true}) : '';
    };

    /**
     * init
     */
    vm.init = function () {
      RequestsService.get({
        requestId: $stateParams.requestId
      }, function (res) {
        vm.request = res;
        mtDebug.info(vm.request);
        vm.commentBuildPager();
      });

    };

    /**
     * commentBuildPager
     * pagination init
     */
    vm.commentBuildPager = function () {
      vm.commentPagedItems = [];
      vm.commentItemsPerPage = vm.itemsPerPageConfig.requestCommentsPerPage;
      vm.commentCurrentPage = 1;
      vm.commentFigureOutItemsToDisplay();
    };

    /**
     * commentFigureOutItemsToDisplay
     * @param callback
     */
    vm.commentFigureOutItemsToDisplay = function (callback) {
      vm.commentFilterLength = vm.request.comments.length;
      var begin = ((vm.commentCurrentPage - 1) * vm.commentItemsPerPage);
      var end = begin + vm.commentItemsPerPage;
      vm.commentPagedItems = vm.request.comments.slice(begin, end);

      if (callback) callback();
    };

    /**
     * commentPageChanged
     * @param autoScroll, some time not scroll to top
     */
    vm.commentPageChanged = function (autoScroll) {
      var element = angular.element('#top_of_comments');

      $('#comment-list-div').fadeTo(100, 0.01, function () {
        vm.commentFigureOutItemsToDisplay(function () {
          $timeout(function () {
            $('#comment-list-div').fadeTo(400, 1, function () {
              if (autoScroll) {
                //window.scrollTo(0, element[0].offsetTop - 30);
                $('html,body').animate({scrollTop: element[0].offsetTop - 30}, 200);
              }
            });
          }, 100);
        });
      });
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
            vm.request.desc = e.getContent();
            vm.request.$update(function (res) {
              vm.request = res;
              NotifycationService.showSuccessNotify('REQUESTS.EDIT_DESC_SUCCESSFULLY');
            }, function (res) {
              NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.EDIT_DESC_FAILED');
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
          $('#' + e.$editor.attr('id') + ' .md-input').textcomplete([
            { // emoji strategy
              match: /\B:([\-+\w]*)$/,
              search: function (term, callback) {
                callback($.map(window.emojies, function (emoji) {
                  return emoji.indexOf(term) === 0 ? emoji : null;
                }));
              },
              template: function (value) {
                return '<img class="ac-emoji" src="/graphics/emojis/' + value + '.png" />' + '<span class="ac-emoji-text">' + value + '</span>';
              },
              replace: function (value) {
                return ':' + value + ': ';
              },
              index: 1
            }
          ]);

          e.setContent(m.desc);
          $('#' + e.$editor.attr('id') + ' .md-input').attr('maxlength', vm.inputLengthConfig.requestDescLength);

          var elei = $('#' + e.$editor.attr('id') + ' .md-input');
          angular.element(elei).css('height', '200px');
          angular.element(elei).css('color', '#333');

          var inputInfo = angular.element('<span></span>');
          inputInfo.addClass('pull-right');
          inputInfo.addClass('input-length');
          inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.requestDescLength);
          $('#' + e.$editor.attr('id') + ' .md-header').append(inputInfo);
          $('#' + e.$editor.attr('id') + ' .md-input').on('input propertychange', function (evt) {
            inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.requestDescLength);
          });

          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
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
          $compile(e.$editor.contents())($scope);
        },
        onPreview: function (e) {
          $('#' + e.$editor.attr('id') + ' .md-footer').css('display', 'none');
        },
        onPreviewEnd: function (e) {
          $('#' + e.$editor.attr('id') + ' .md-footer').css('display', 'block');
        }
      });
    };

    /**
     * removeRequest
     */
    vm.removeRequest = function () {
      var modalOptions = {
        closeButtonText: $translate.instant('REQUESTS.DELETE_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('REQUESTS.DELETE_CONFIRM_OK'),
        headerText: $translate.instant('REQUESTS.DELETE_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('REQUESTS.DELETE_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          vm.request.$remove(function (res) {
            NotifycationService.showSuccessNotify('REQUESTS.DELETE_SUCCESSFULLY');
            $state.go($state.previous.state.name || 'requests.list');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.DELETE_FAILED');
          });
        });
    };

    /**
     * onRequestTitleEdited
     */
    $scope.onRequestTitleEdited = function (modifyed) {
      if (vm.request && modifyed) {
        vm.request.$update(function (res) {
          vm.request = res;
          NotifycationService.showSuccessNotify('REQUESTS.EDIT_SUCCESSFULLY');
        }, function (res) {
          NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.EDIT_FAILED');
        });
      }
    };

    /**
     * acceptResponse
     */
    vm.acceptResponse = function (t) {
      var modalOptions = {
        closeButtonText: $translate.instant('REQUESTS.ACCEPT_CONFIRM_CANCEL'),
        actionButtonText: $translate.instant('REQUESTS.ACCEPT_CONFIRM_OK'),
        headerText: $translate.instant('REQUESTS.ACCEPT_CONFIRM_HEADER_TEXT'),
        bodyText: $translate.instant('REQUESTS.ACCEPT_CONFIRM_BODY_TEXT')
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          vm.request.$accept({
            torrentId: t._id
          }, function (res) {
            vm.request = res;
            NotifycationService.showSuccessNotify('REQUESTS.ACCEPT_SUCCESSFULLY');
          }, function (res) {
            NotifycationService.showErrorNotify(res.data.message, 'REQUESTS.ACCEPT_FAILED');
          });
        });
    };

    /**
     * isExpired
     * @returns {boolean}
     */
    vm.isExpired = function (r) {
      var exp = false;
      if (r) {
        exp = (r.createdAt + vm.requestsConfig.requestExpires) > Date.now() ? false : true;
      }

      return exp;
    };
  }
}());
