(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangeSignatureController', ChangeSignatureController);

  ChangeSignatureController.$inject = ['$state', '$scope', 'Authentication', 'UsersService', 'NotifycationService', 'marked', '$translate', 'localStorageService', '$compile',
    'MeanTorrentConfig'];

  function ChangeSignatureController($state, $scope, Authentication, UsersService, NotifycationService, marked, $translate, localStorageService, $compile,
                                     MeanTorrentConfig) {
    var vm = this;
    vm.user = Authentication.user;
    vm.inputLengthConfig = MeanTorrentConfig.meanTorrentConfig.inputLength;

    /**
     * getSignatureContent
     * @returns {*}
     */
    vm.getSignatureContent = function () {
      return marked(vm.user.signature || $translate.instant('MAKER_NULL'), {sanitize: true});
    };

    /**
     * beginEditSignature
     */
    vm.beginEditSignature = function () {
      var el = $('#signature');

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
            //save content
            UsersService.changeSignature({signature: e.getContent()})
              .then(function (res) {
                vm.user = Authentication.user = res;
                $state.reload();
                NotifycationService.showSuccessNotify('EDIT_SIGNATURE_SUCCESSFULLY');
              })
              .catch(function (res) {
                NotifycationService.showErrorNotify(res.data.message, 'EDIT_SIGNATURE_ERROR');
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

          e.setContent(vm.user.signature || $translate.instant('MAKER_NULL'));
          $('#' + e.$editor.attr('id') + ' .md-input').attr('maxlength', vm.inputLengthConfig.userSignatureLength);

          var inputInfo = angular.element('<span></span>');
          inputInfo.addClass('pull-right');
          inputInfo.addClass('input-length');
          inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.userSignatureLength);
          $('#' + e.$editor.attr('id') + ' .md-header').append(inputInfo);
          $('#' + e.$editor.attr('id') + ' .md-input').on('input propertychange', function (evt) {
            inputInfo.text(e.getContent().length + '/' + vm.inputLengthConfig.userSignatureLength);
          });

          var ele = $('#' + e.$editor.attr('id') + ' .md-footer');
          angular.element(ele).addClass('text-right');
          angular.element(ele[0].childNodes[0]).addClass('btn-min-width-80');
          ele[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-default btn-min-width-80 margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
          cbtn.bind('click', function (evt) {
            e.setContent(vm.user.signature || $translate.instant('MAKER_NULL'));
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
          $('#' + e.$editor.attr('id') + ' .md-footer').css('display', 'none');
        }
      });
    };
  }
}());
