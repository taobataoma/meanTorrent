(function () {
  'use strict';

  angular.module('core')
    .directive('mtMarkdownEditor', mtMarkdownEditor);

  mtMarkdownEditor.$inject = ['localStorageService', '$compile', 'NotifycationService', '$timeout'];

  function mtMarkdownEditor(localStorageService, $compile, NotifycationService, $timeout) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      replace: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      $(element).markdown({
        autofocus: false,
        savable: false,
        iconlibrary: 'fa',
        resize: 'vertical',
        language: localStorageService.get('storage_user_lang'),
        fullscreen: {enable: false},
        onChange: function (e) {
          ngModel.$setViewValue($('#' + attrs.mtMarkdownEditor)[0].value);
        },
        onShow: function (e) {
          scope.uFile = undefined;
          scope.uProgress = 0;
          scope.uFiles = [];
          scope.uImages = [];

          var eleUploadTip = angular.element('<div class="attach-info text-long" ng-show="!uFile"><div class="attach-upload-tooltip">{{\'FORUMS.ATTACH_UPLOAD_TOOLTIP\' | translate}}</div></div>');
          var eleUploadBegin = angular.element('<div class="upload-info" ng-show="uFile"><i class="fa fa-cog fa-spin fa-lg fa-fw"></i> <div class="attach-upload-progress" style="width: {{uProgress}}%"></div><div class="attach-upload-filename">{{\'FORUMS.ATTACH_UPLOADING\' | translate}}: {{uFile.name}}</div></div>');
          var eleUploadList = angular.element('<div class="attach-list" ng-show="uFiles.length"><div><ol><li ng-repeat="f in uFiles track by $index">{{f.name}}　<i class="fa fa-times" ng-click="removeAttach($index)"></i></li></ol></div></div>');

          //$compile(eleUploadTip)(scope);
          //$compile(eleUploadBegin)(scope);
          //$compile(eleUploadList)(scope);

          $('.md-editor').append(eleUploadTip);
          $('.md-editor').append(eleUploadBegin);
          $('.md-editor').append(eleUploadList);

          scope.removeAttach = function (idx) {
            scope.uFiles.splice(idx, 1);
          };

          $('.md-editor').bind('dragenter', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
          });
          $('.md-editor').bind('dragover', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
          });

          $('.md-editor').bind('drop', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();

            if (attrs.uploadMethod) {
              scope.uFile = evt.originalEvent.dataTransfer.files[0];
              scope.uProgress = 0;

              scope.$eval(attrs.uploadMethod, {
                editor: e,
                ufile: scope.uFile,
                progressback: function (pr) {
                  scope.uProgress = pr;
                },
                callback: function (fn) {
                  var uFile = {
                    name: fn,
                    size: scope.uFile.size
                  };
                  var status = '';
                  var ext = uFile.name.replace(/^.+\./, '').toLowerCase();
                  if (ext === 'jpg' || ext === 'jpeg' || ext === 'bmp' || ext === 'gif' || ext === 'png') {
                    status = '\n![' + uFile.name + '](/modules/forums/client/attach/temp/' + uFile.name + ')\n';
                    e.replaceSelection(status);
                    ngModel.$setViewValue($('#' + attrs.mtMarkdownEditor)[0].value);
                    scope.uImages.push(uFile);
                  } else {
                    scope.uFiles.push(uFile);
                  }

                  scope.uFile = undefined;
                  scope.uProgress = 0;
                  NotifycationService.showSuccessNotify('FORUMS.UPLOAD_ATTACH_SUCCESSFULLY');
                },
                errback: function (err) {
                  scope.uFile = undefined;
                  scope.uProgress = 0;
                  NotifycationService.showErrorNotify(err.data, 'FORUMS.UPLOAD_ATTACH_FAILED');
                }
              });
            }
            return false;
          });

          $compile($('.md-editor').contents())(scope);
        }
      });
    }
  }
}());
