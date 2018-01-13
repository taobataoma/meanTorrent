(function () {
  'use strict';

  angular
    .module('torrents.services')
    .factory('DownloadService', DownloadService);

  DownloadService.$inject = ['$http', 'FileSaver', 'NotifycationService', 'DebugConsoleService'];

  function DownloadService($http, FileSaver, NotifycationService, mtDebug) {

    return {
      downloadFile: downloadFile,
      downloadTorrent: downloadTorrent,
      downloadSubtitle: downloadSubtitle,
      downloadForumAttach: downloadForumAttach,
      downloadBackupFile: downloadBackupFile
    };

    /**
     * downloadTorrent
     * @param id
     */
    function downloadTorrent(id) {
      var url = '/api/torrents/download/' + id;
      downloadFile(url, null, function (status) {
        if (status === 200) {
          NotifycationService.showSuccessNotify('TORRENTS_DOWNLOAD_SUCCESSFULLY');
        }
      }, function (err) {
        mtDebug.info(err);
        switch (err.status) {
          case 701:
            NotifycationService.showErrorNotify('SERVER.ONLY_VIP_CAN_DOWNLOAD', 'TORRENT_DOWNLOAD_ERROR');
            break;
          case 702:
            NotifycationService.showErrorNotify('SERVER.CAN_NOT_DOWNLOAD_BANNED', 'TORRENT_DOWNLOAD_ERROR');
            break;
          case 703:
            NotifycationService.showErrorNotify('SERVER.CAN_NOT_DOWNLOAD_IDLE', 'TORRENT_DOWNLOAD_ERROR');
            break;
          case 704:
            NotifycationService.showErrorNotify('SERVER.TORRENT_STATUS_ERROR', 'TORRENT_DOWNLOAD_ERROR');
            break;
          default:
            NotifycationService.showErrorNotify(err.data.message, 'TORRENT_DOWNLOAD_ERROR');
        }
      });
    }

    /**
     * downloadSubtitle
     * @param tid
     * @param sid
     */
    function downloadSubtitle(tid, sid) {
      var url = '/api/subtitles/' + tid + '/' + sid;
      downloadFile(url, null, function (status) {
        if (status === 200) {
          NotifycationService.showSuccessNotify('SUBTITLE_DOWNLOAD_SUCCESSFULLY');
        }
      }, function (err) {
        mtDebug.info(err);
        NotifycationService.showErrorNotify(err.data.message, 'SUBTITLE_DOWNLOAD_ERROR');
      });
    }

    /**
     * downloadForumAttach
     * @param tid
     * @param rid
     * @param aid
     */
    function downloadForumAttach(tid, rid, aid) {
      var url = '/api/attach/' + tid;
      url += rid ? '/' + rid : '';
      url += '?attachId=' + aid;

      downloadFile(url, null, function (status) {
        if (status === 200) {
          NotifycationService.showSuccessNotify('FORUMS.ATTACHE_DOWNLOAD_SUCCESSFULLY');
        }
      }, function (err) {
        mtDebug.info(err);
        NotifycationService.showErrorNotify(err.data.message, 'FORUMS.ATTACHE_DOWNLOAD_FAILED');
      });
    }

    /**
     * downloadBackupFile
     * @param fname
     */
    function downloadBackupFile(fname) {
      var url = '/api/backup/' + fname;

      downloadFile(url, null, function (status) {
        if (status === 200) {
          NotifycationService.showSuccessNotify('BACKUP.DOWNLOAD_SUCCESSFULLY');
        }
      }, function (err) {
        mtDebug.info(err);
        NotifycationService.showErrorNotify(err.data.message, 'BACKUP.DOWNLOAD_FAILED');
      });
    }

    /**
     * downloadFile
     * @param url
     * @param request
     * @param successcb
     * @param errorcb
     */
    function downloadFile(url, request, successcb, errorcb) {
      $http({
        url: url,
        method: 'GET',
        params: request,
        responseType: 'blob'
      }).then(function successCallback(response) {
        var contentDisposition = response.headers('Content-Disposition');
        var fileName = decodeURI(contentDisposition.substr(contentDisposition.indexOf('filename*=UTF-8\'\'') + 17));
        FileSaver.saveAs(response.data, fileName);

        if (successcb) successcb(response.status);
      }, function errorCallback(response) {
        if (errorcb) errorcb(response);
      });
    }
  }
}());
