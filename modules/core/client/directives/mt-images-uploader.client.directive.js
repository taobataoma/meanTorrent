(function () {
  'use strict';

  angular.module('core')
    .directive('mtImagesUploader', mtImagesUploader);

  mtImagesUploader.$inject = ['$rootScope', 'localStorageService', '$compile', 'NotifycationService', '$translate', 'DebugConsoleService', '$timeout'];

  function mtImagesUploader($rootScope, localStorageService, $compile, NotifycationService, $translate, mtDebug, $timeout) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      scope: {ngModel: '='},
      replace: true,
      link: link
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      if (attrs.uploadMethod) {
        initVariable();

        var eleUploadList = angular.element('<div class="upload-image-list" ng-show="uResourceImages.length"><span class="image-item" ng-repeat="f in uResourceImages track by $index"><img ng-src="{{f}}" on-image-load="showFaTimes($index)"><i id="fa-{{$index}}" style="display: none;" class="fa fa-times" ng-click="removeImage($index)" mt-scale-by-mouse="{scale: 1.5, duration: \'.3s\'}"></i></img></span></div>');
        var eleUploadTip = angular.element('<div class="upload-image-info" ng-show="!uFile"><div class="upload-tooltip text-long"><span>{{\'IMAGES_UPLOAD_TOOLTIP1\' | translate}}</span><input type="file" class="manual-file-chooser" ng-model="selectedFile" ngf-select="onFileSelected($event);"><span class="btn-link manual-file-chooser-text">{{\'IMAGES_UPLOAD_TOOLTIP2\' | translate}}</span></div></div>');
        var eleUploadBegin = angular.element('<div class="upload-info" ng-show="uFile"><i class="fa fa-cog fa-spin fa-lg fa-fw"></i> <div class="upload-progress" style="width: {{uProgress}}%"></div><div class="upload-filename">{{\'IMAGES_UPLOADING\' | translate}}: {{uFile.name}}</div></div>');
        var eleUploadLink = angular.element('<div class="upload-image-link"><div class="input-group"><input type="text" class="form-control" ng-model="selectedLink" placeholder="{{\'IMAGES_UPLOAD_TOOLTIP3\' | translate}}" ng-keydown="onLinkKeyDown($event);" autofocus><span class="input-group-btn"><button class="btn btn-default" ng-click="addLinkClick($event);" ng-disabled="!selectedLink">{{\'BTN_ADD_LINK\' | translate}}</button></span></div></div>');

        element.append(eleUploadList);
        element.append(eleUploadTip);
        element.append(eleUploadBegin);
        element.append(eleUploadLink);

        scope.$watch(function () {
          return element.find('.upload-image-list').prop('scrollWidth');
        }, function (newVal, oldVal) {
          if (newVal && scope.isEdited) {
            var cw = element.find('.upload-image-list').prop('clientWidth');
            var sw = element.find('.upload-image-list').prop('scrollWidth');

            if (sw > cw) {
              $timeout(function () {
                element.find('.upload-image-list').animate({scrollLeft: sw - cw}, 100);
              }, 10);
            }
          }
        });

        scope.removeImage = function (idx) {
          scope.ngModel.splice(idx, 1);
          scope.uResourceImages.splice(idx, 1);
        };

        scope.onFileSelected = function (evt) {
          doUpload(scope.selectedFile);
        };

        scope.onLinkKeyDown = function (evt) {
          if (evt.keyCode === 13 && scope.selectedLink) {
            scope.addLinkClick(evt);
          }
        };

        scope.addLinkClick = function (evt) {
          if (scope.selectedLink.startsWith('http://') || scope.selectedLink.startsWith('https://')) {
            scope.ngModel.push(scope.selectedLink);
            scope.uResourceImages.push(scope.selectedLink);
            scope.selectedLink = null;
            scope.isEdited = true;
          } else {
            NotifycationService.showErrorNotify($translate.instant('ERROR_IMAGE_LINK_URL'), 'ERROR');
          }
        };

        scope.showFaTimes = function (idx) {
          $('.image-item').find('#fa-' + idx).css('display', 'block');
        };

        element.bind('dragenter', function (evt) {
          evt.stopPropagation();
          evt.preventDefault();
        });
        element.bind('dragover', function (evt) {
          evt.stopPropagation();
          evt.preventDefault();
        });

        element.bind('drop', function (evt) {
          evt.stopPropagation();
          evt.preventDefault();

          doUpload(evt.originalEvent.dataTransfer.files[0]);
          return false;
        });

        //define method called from parent scope
        //init all variable
        $rootScope.clearResourceImages = function () {
          scope.ngModel = [];
          initVariable();
        };
        $compile(element.contents())(scope);
      }

      /**
       * initVariable
       */
      function initVariable() {
        scope.uFile = undefined;
        scope.isEdited = false;
        scope.uProgress = 0;
        scope.uResourceImages = angular.copy(scope.ngModel);
      }

      /**
       * doUpload
       * @param sFile
       */
      function doUpload(sFile) {
        if (!sFile) {
          return;
        }

        if (sFile.type !== 'image/png' && sFile.type !== 'image/jpg' && sFile.type !== 'image/jpeg' && sFile.type !== 'image/gif' && sFile.type !== 'image/bmp') {
          NotifycationService.showErrorNotify($translate.instant('ERROR_ONLY_IMAGE'), 'ERROR');
          console.error($translate.instant('ERROR_ONLY_IMAGE'));
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
            ufile: scope.uFile,
            progressback: function (pr) {
              scope.uProgress = pr;
            },
            callback: function (fn) {
              var uFile = {
                name: fn,
                size: scope.uFile.size
              };

              scope.ngModel.push(uFile.name);
              scope.uResourceImages.push(attrs.uploadDir + uFile.name);
              scope.isEdited = true;

              scope.uFile = undefined;
              scope.uProgress = 0;
              NotifycationService.showSuccessNotify('UPLOAD_IMAGES_SUCCESSFULLY');
            },
            errback: function (err) {
              scope.uFile = undefined;
              scope.uProgress = 0;
              NotifycationService.showErrorNotify(err.data, 'UPLOAD_IMAGES_FAILED');
            }
          });
        }
      }
    }
  }
}());
