(function () {
  'use strict';

  angular.module('core')
    .directive('mtMarkdownEditor', mtMarkdownEditor);

  mtMarkdownEditor.$inject = ['localStorageService', '$compile', 'NotifycationService', '$translate', 'DebugConsoleService', '$timeout'];

  function mtMarkdownEditor(localStorageService, $compile, NotifycationService, $translate, mtDebug, $timeout) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      scope: {ngModel: '='},
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
          scope.ngModel = $('#' + attrs.mtMarkdownEditor)[0].value;
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
          ], {
            dropdownClassName: 'dropdown-menu textcomplete-dropdown' + (attrs.hasOwnProperty('emojiDropup') ? ' textcomplete-dropup' : '')
          });

          if (attrs.maxlength) {
            var inputInfo = angular.element('<span></span>');
            inputInfo.addClass('pull-right');
            inputInfo.addClass('input-length');
            inputInfo.text(e.getContent().length + '/' + attrs.maxlength);
            $('#' + e.$editor.attr('id') + ' .md-header').append(inputInfo);
            scope.$watch('ngModel', function () {
              $timeout(inputInfo.text(e.getContent().length + '/' + attrs.maxlength));
              scope.$eval(attrs.ngModel + ' = ngModel');
            });
          }

          if (attrs.uploadMethod) {
            scope.uFile = undefined;
            scope.uProgress = 0;
            scope.uFiles = [];
            scope.$parent.uFiles = [];
            scope.uImages = [];
            scope.$parent.uImages = [];

            var eleUploadTip = angular.element('<div class="attach-info" ng-show="!uFile"><div class="attach-upload-tooltip text-long"><span>{{\'FORUMS.ATTACH_UPLOAD_TOOLTIP1\' | translate}}</span><input type="file" class="manual-file-chooser" ng-model="selectedFile" ngf-select="onFileSelected($event);"><span class="btn-link manual-file-chooser-text">{{\'FORUMS.ATTACH_UPLOAD_TOOLTIP2\' | translate}}</span>{{\'FORUMS.ATTACH_UPLOAD_TOOLTIP3\' | translate}}</div></div>');
            var eleUploadBegin = angular.element('<div class="upload-info" ng-show="uFile"><i class="fa fa-cog fa-spin fa-lg fa-fw"></i> <div class="attach-upload-progress" style="width: {{uProgress}}%"></div><div class="attach-upload-filename">{{\'FORUMS.ATTACH_UPLOADING\' | translate}}: {{uFile.name}}</div></div>');
            var eleUploadList = angular.element('<div class="attach-list" ng-show="uFiles.length"><div><ol><li ng-repeat="f in uFiles track by $index">{{f.name}}　<i class="fa fa-times" ng-click="removeAttach($index)"></i></li></ol></div></div>');

            //$compile(eleUploadTip)(scope);
            //$compile(eleUploadBegin)(scope);
            //$compile(eleUploadList)(scope);
            $('#' + e.$editor.attr('id')).append(eleUploadTip);
            $('#' + e.$editor.attr('id')).append(eleUploadBegin);
            $('#' + e.$editor.attr('id')).append(eleUploadList);

            scope.removeAttach = function (idx) {
              scope.uFiles.splice(idx, 1);
              scope.$parent.uFiles.splice(idx, 1);
            };

            scope.onFileSelected = function (evt) {
              doUpload(scope.selectedFile);
            };

            $('#' + e.$editor.attr('id')).bind('dragenter', function (evt) {
              evt.stopPropagation();
              evt.preventDefault();
            });
            $('#' + e.$editor.attr('id')).bind('dragover', function (evt) {
              evt.stopPropagation();
              evt.preventDefault();
            });

            $('#' + e.$editor.attr('id')).bind('drop', function (evt) {
              evt.stopPropagation();
              evt.preventDefault();

              doUpload(evt.originalEvent.dataTransfer.files[0]);
              return false;
            });
          }

          $compile($('#' + e.$editor.attr('id')).contents())(scope);

          /**
           * doUpload
           * @param sFile
           */
          function doUpload(sFile) {
            if (!sFile) {
              return;
            }

            if (attrs.uploadOnlyImage) {
              if (sFile.type !== 'image/png' && sFile.type !== 'image/jpg' && sFile.type !== 'image/jpeg' && sFile.type !== 'image/gif' && sFile.type !== 'image/bmp') {
                NotifycationService.showErrorNotify($translate.instant('ERROR_ONLY_IMAGE'), 'ERROR');
                console.error($translate.instant('ERROR_ONLY_IMAGE'));
                return;
              }
            }

            if (sFile.type === 'text/javascript') {
              NotifycationService.showErrorNotify($translate.instant('FILE_TYPE_ERROR'), 'ERROR');
              console.error($translate.instant('FILE_TYPE_ERROR'));
              return;
            }

            if (attrs.uploadMethod) {
              scope.uFile = sFile;
              scope.uProgress = 0;

              if (!attrs.uploadDir) {
                console.error('uploadMethod must has a uploadDir attr!');
                return;
              }

              scope.$parent.$eval(attrs.uploadMethod, {
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
                    status = '\n![' + uFile.name + '](' + attrs.uploadDir + uFile.name + ')\n';
                    e.replaceSelection(status);
                    scope.ngModel = $('#' + attrs.mtMarkdownEditor)[0].value;

                    scope.uImages.push(uFile);
                    scope.$parent.uImages.push(uFile);
                  } else {
                    scope.uFiles.push(uFile);
                    scope.$parent.uFiles.push(uFile);
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
          }
        }
      });
    }
  }
}());
