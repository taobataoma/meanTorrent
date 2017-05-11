(function () {
  'use strict';

  angular
    .module('chat')
    .controller('ChatController', ChatController);

  ChatController.$inject = ['$scope', '$state', '$timeout', 'Authentication', 'Socket', '$translate'];

  function ChatController($scope, $state, $timeout, Authentication, Socket, $translate) {
    var vm = this;

    vm.user = Authentication.user;
    vm.messages = [];
    vm.users = [];
    vm.messageText = '';
    vm.scrollAtBottom = true;

    init();

    /**
     * init all event bundle
     */
    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }

      // Add an event listener to the 'chatMessage' event
      Socket.on('chatMessage', function (message) {
        var e = angular.element('#chat-body');
        vm.messages.push(message);
      });

      // add an event listener to the 'usersList' event
      Socket.on('usersList', function (us) {
        vm.onUsersList(us);
      });

      // add an event listener to the 'usersList' event
      Socket.on('join', function (us) {
        vm.onUsersJoin(us);
      });

      // add an event listener to the 'usersList' event
      Socket.on('quit', function (us) {
        vm.onUsersQuit(us);
      });


      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.removeListener('chatMessage');
        Socket.removeListener('usersList');
        Socket.removeListener('join');
        Socket.removeListener('quit');
      });
    }

    /**
     * $watch 'vm.messages'
     * when changed, scroll to bottom
     */
    $scope.$watch('vm.messages.length', function (newValue, oldValue) {
      //console.log('vm.messages changed');
    });

    /**
     * onMessageRepeatDone
     */
    vm.onMessageRepeatDone = function () {
      var e = angular.element('#chat-body');

      if (vm.scrollAtBottom) {
        $timeout(function () {
          e.animate({scrollTop: e[0].scrollHeight}, 300);
        }, 100);
      }
    };

    /**
     * sendMessage
     * Create a controller method for sending messages
     */
    vm.sendMessage = function () {
      // Create a new message object
      var message = {
        text: vm.messageText
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      vm.messageText = '';
    };

    /**
     * initChatView
     * init the view height
     */
    vm.initChatView = function () {
      var e = angular.element('.chat-messages');
      var u = angular.element('.chat-users');
      var h = document.documentElement.clientHeight - 50 - 16;
      e.css('height', h + 'px');
      u.css('height', h + 'px');

      var footer = angular.element('footer');
      footer.css('display', 'none');

      var bodysize = angular.element('.bodysize');
      bodysize.css('backgroundColor', '#f7f7f7');
    };

    /**
     * onInputKeyDown
     * @param evt
     */
    vm.onInputKeyDown = function (evt) {
      if (evt.keyCode === 13 && vm.messageText) {
        vm.sendMessage();
        //evt.stopPropagation();
        evt.preventDefault();
      }
    };

    /**
     * onUsersList
     * @param us
     */
    vm.onUsersList = function (us) {
      vm.users = us;
    };

    /**
     * onUsersJoin
     * @param u
     */
    vm.onUsersJoin = function (u) {
      vm.users.push(u);

      u.text = $translate.instant('CHAT_USER_JOIN');
      vm.messages.push(u);
    };

    /**
     * onUsersQuit
     * @param u
     */
    vm.onUsersQuit = function (u) {
      vm.users.splice(vm.users.indexOf(u), 1);
    };

    /**
     * onMessageScroll
     * @param evt
     */
    vm.onMessageScroll = function (evt) {
      var e = evt.srcElement;
      if (e.scrollTop + e.offsetHeight >= e.scrollHeight) {
        vm.scrollAtBottom = true;
      } else {
        vm.scrollAtBottom = false;
      }
    };
  }
}());
