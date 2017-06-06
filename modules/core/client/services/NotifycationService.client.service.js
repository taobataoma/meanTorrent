(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('core')
    .factory('NotifycationService', NotifycationService);

  NotifycationService.$inject = ['$translate', 'Notification'];

  function NotifycationService($translate, Notification) {

    var service = {
      showNotify: showNotify,
      showSuccessNotify: showSuccessNotify,
      showErrorNotify: showErrorNofity
    };

    return service;

    function showNotify(type, icon, msgid) {
      var msg = $translate.instant(msgid);
      switch (type) {
        case 'info':
          Notification.info({
            message: '<i class="glyphicon ' + icon + '"></i> ' + msg
          });
          break;
        case 'success':
          Notification.success({
            message: '<i class="glyphicon ' + icon + '"></i> ' + msg
          });
          break;
        case 'primary':
          Notification.primary({
            message: '<i class="glyphicon ' + icon + '"></i> ' + msg
          });
          break;
        case 'warning':
          Notification.warning({
            message: '<i class="glyphicon ' + icon + '"></i> ' + msg
          });
          break;
        case 'error':
          Notification.error({
            message: '<i class="glyphicon ' + icon + '"></i> ' + msg
          });
          break;
        default:
          Notification.info({
            message: '<i class="glyphicon ' + icon + '"></i> ' + msg
          });
      }
    }

    function showSuccessNotify(msgId) {
      var msg = $translate.instant(msgId);

      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
      });
    }

    function showErrorNofity(msg, titleMsgId) {
      var title_msg = $translate.instant(titleMsgId);

      if (msg) {
        Notification.error({
          message: msg,
          title: '<i class="glyphicon glyphicon-remove"></i> ' + title_msg
        });
      } else {
        Notification.error({
          message: '<i class="glyphicon glyphicon-remove"></i> ' + title_msg
        });
      }
    }
  }
}());
