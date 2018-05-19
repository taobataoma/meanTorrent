(function () {
  'use strict';

  angular.module('core')
    .directive('editableLine', editableLine);

  editableLine.$inject = [];

  function editableLine() {
    var highlightColor = 'transparent';

    return {
      restrict: 'A',
      require: '^ngModel',
      scope: {
        ngModel: '=ngModel',
        callback: '=',
        callbackParameter: '=',
        linkCallback: '=',
        readonly: '=',
        placeHolder: '@'
      },
      template: '<input ng-model="ngModel" class="editable-line editable-line-input"><span class="editable-line editable-line-display" title="{{ \'FORUMS.CLICK_TO_EDIT\' | translate}}"></span>',

      link: function ($scope, $element, $attr) {
        $scope.div = jQuery($element).find('.editable-line-display');
        $scope.input = jQuery($element).find('.editable-line-input');
        $scope.originalDivBackground = $scope.div.css('background-color');

        $scope.div.awesomeCursor('pencil', {
          color: '#ff6000',
          flip: 'vertical',
          outline: '#ff3e00'
        });

        var originalValue;
        $scope.div.bind('click', function () {
          if ($scope.readonly) {
            return;
          }
          originalValue = $scope.ngModel;
          // get the cursor offset from display DIV
          var sel = window.getSelection();
          var offset = sel.focusOffset;
          // hide DIV and show INPUT
          $scope.div.css('display', 'none');
          $scope.input.css('display', 'block');
          $scope.input.focus();
          // Move cursor to the same offset
          var node = $scope.input.get(0);
          node.setSelectionRange(offset, offset);
        });
        $scope.input.bind('blur', function () {
          if ($scope.callback) {
            if (!$scope.ngModel) {
              $scope.ngModel = originalValue;
              $scope.$apply();
            }
            if ($scope.callbackParameter !== undefined) {
              $scope.callback($scope.ngModel !== originalValue, $scope.callbackParameter);
            } else {
              $scope.callback($scope.ngModel !== originalValue);
            }
          }

          $scope.div.css('display', 'block');
          $scope.input.css('display', 'none');
          $scope.refresh();
        });

        $scope.div.bind('mouseover', function () {
          if ($scope.readonly) {
            return;
          }
          $scope.div.css('background-color', highlightColor);
        });
        $scope.div.bind('mouseout', function () {
          $scope.div.css('background-color', '');  // Removing CSS from DIV
        });
        $element.bind('keydown', function (event) {
          if (event.which === 13) {
            event.target.blur();
          } else if (event.which === 27) {
            // ESC key
            $scope.ngModel = originalValue;
            $scope.$apply();
            event.target.blur();
          }
        });

        $scope.refresh = function () {
          var linkify = false;
          var displayHtml = '&nbsp;';

          if (!$scope.readonly && ($scope.ngModel === '' || $scope.ngModel === undefined)) {
            $scope.div.addClass('editable-line-placeholder');
            if ($scope.placeHolder) {
              displayHtml = $scope.placeHolder;
            } else {
              displayHtml = '&nbsp;';
            }
          } else {
            $scope.div.removeClass('editable-line-placeholder');
            if ($scope.linkCallback) {
              displayHtml = '<a class="generated-link" target="_blank" href="' + $scope.linkCallback($scope.ngModel) + '">' + $scope.ngModel + '</a>';
            } else {
              displayHtml = $scope.ngModel;
            }
          }
          $scope.div.html(displayHtml);
          if ($scope.linkCallback) {
            $scope.div.find('a.generated-link').click(function (e) {
              e.stopPropagation();
            });
          }
        };

        $scope.$watch('ngModel', $scope.refresh);
        // initialize
        $scope.input.css('display', 'none');
        $scope.input.css('background', highlightColor);
      }
    };
  }
}());
