(function () {
  'use strict';

  angular
    .module('invitations.services')
    .factory('InvitationsService', InvitationsService);

  InvitationsService.$inject = ['$resource', 'CacheFactory'];

  function InvitationsService($resource, CacheFactory) {
    var invitationsCache = CacheFactory.get('invitationsCache') || CacheFactory.createCache('invitationsCache');
    var removeCache = function (res) {
      invitationsCache.removeAll();
      return res.resource;
    };

    return $resource('/api/invitations/:invitationId', {
      invitationId: '@_id'
    }, {
      get: {
        method: 'GET',
        cache: invitationsCache
      },
      query: {
        method: 'GET',
        isArray: true,
        cache: invitationsCache
      },
      update: {
        method: 'PUT',
        interceptor: {response: removeCache}
      },
      save: {
        method: 'POST',
        interceptor: {response: removeCache}
      },
      remove: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      delete: {
        method: 'DELETE',
        interceptor: {response: removeCache}
      },
      verifyToken: {
        method: 'GET',
        url: '/api/invitations/token/:token',
        params: {
          token: '@token'
        }
      },
      countInvitations: {
        method: 'GET',
        url: '/api/invitations/count'
      },
      sendOfficial: {
        method: 'POST',
        url: '/api/invitations/official/send',
        interceptor: {response: removeCache}
      },
      listOfficial: {
        method: 'GET',
        url: '/api/invitations/official/list',
        isArray: true,
        cache: invitationsCache
      },
      deleteExpiredOfficialInvitation: {
        method: 'DELETE',
        url: '/api/invitations/official/deleteExpired',
        interceptor: {response: removeCache}
      }
    });
  }
}());
