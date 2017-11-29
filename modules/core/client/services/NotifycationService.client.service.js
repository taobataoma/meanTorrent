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

    function showNotify(type, iconClass, msgid, trans = true) {
      var msg = trans ? $translate.instant(msgid) : msgid;
      var iconStr = '';

      if (iconClass) {
        iconStr = '<i class="' + iconClass + '"></i> ';
      }
      switch (type) {
        case 'info':
          Notification.info({
            message: iconStr + msg
          });
          break;
        case 'success':
          Notification.success({
            message: iconStr + msg
          });
          break;
        case 'primary':
          Notification.primary({
            message: iconStr + msg
          });
          break;
        case 'warning':
          Notification.warning({
            message: iconStr + msg
          });
          break;
        case 'error':
          Notification.error({
            message: iconStr + msg
          });
          break;
        default:
          Notification.info({
            message: iconStr + msg
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
      var title_msg = titleMsgId ? $translate.instant(titleMsgId) : '';

      if (msg && titleMsgId) {
        Notification.error({
          message: msg,
          title: '<i class="glyphicon glyphicon-remove"></i> ' + title_msg
        });
      } else {
        if (!msg && titleMsgId) {
          Notification.error({
            message: '<i class="glyphicon glyphicon-remove"></i> ' + title_msg
          });
        }
        if (msg && !titleMsgId) {
          Notification.error({
            message: '<i class="glyphicon glyphicon-remove"></i> ' + msg
          });
        }
      }
    }
  }
}());
