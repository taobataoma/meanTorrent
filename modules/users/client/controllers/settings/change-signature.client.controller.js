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
    vm.forumsConfig = MeanTorrentConfig.meanTorrentConfig.forumsConfig;

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
            var newSignature = e.getContent().substr(0, vm.forumsConfig.signatureLength);
            UsersService.changeSignature({signature: newSignature})
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
          e.setContent(vm.user.signature || $translate.instant('MAKER_NULL'));

          angular.element($('.md-footer')).addClass('text-right');
          angular.element($('.md-footer')[0].childNodes[0]).addClass('btn-width-80');
          $('.md-footer')[0].childNodes[0].innerText = $translate.instant('FORUMS.BTN_SAVE');

          var cbtn = angular.element('<button class="btn btn-default btn-width-80 margin-left-10">' + $translate.instant('FORUMS.BTN_CANCEL') + '</button>');
          cbtn.bind('click', function (evt) {
            e.setContent(vm.user.signature || $translate.instant('MAKER_NULL'));
            e.$options.hideable = true;
            e.blur();
          });
          $('.md-footer').append(cbtn);
          $compile($('.md-footer').contents())($scope);
        },
        onPreview: function (e) {
          $('.md-footer').css('display', 'none');
        },
        onPreviewEnd: function (e) {
          $('.md-footer').css('display', 'block');
        }
      });
    };
  }
}());
