(function () {
  'use strict';

  angular
    .module('invitations.services')
    .factory('InvitationsService', InvitationsService);

  InvitationsService.$inject = ['$resource', 'CacheFactory'];

  function InvitationsService($resource, CacheFactory) {
    var invitationsCache = CacheFactory.get('invitationsCache') || CacheFactory.createCache('invitationsCache');

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
        method: 'PUT'
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
        url: '/api/invitations/official/send'
      },
      listOfficial: {
        method: 'GET',
        url: '/api/invitations/official/list',
        isArray: true,
        cache: invitationsCache
      },
      deleteExpiredOfficialInvitation: {
        method: 'DELETE',
        url: '/api/invitations/official/deleteExpired'
      }
    });
  }
}());
