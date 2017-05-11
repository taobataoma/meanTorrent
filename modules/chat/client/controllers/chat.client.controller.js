(function () {
  'use strict';

  angular
    .module('chat')
    .controller('ChatController', ChatController);

  ChatController.$inject = ['$scope', '$state', '$timeout', 'Authentication', 'Socket', '$translate', '$sanitize', '$sce'];

  function ChatController($scope, $state, $timeout, Authentication, Socket, $translate, $sanitize, $sce) {
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
    $scope.$watch('vm.fontStyleBold', function (newValue, oldValue) {
      if (newValue) {
        angular.element('#messageText').css('font-weight', 'bold');
      } else {
        angular.element('#messageText').css('font-weight', 'normal');
      }
    });
    $scope.$watch('vm.fontStyleItalic', function (newValue, oldValue) {
      if (newValue) {
        angular.element('#messageText').css('font-style', 'italic');
      } else {
        angular.element('#messageText').css('font-style', 'normal');
      }
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
        text: sanitizeHTML(vm.messageText)
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      vm.messageText = '';
    };

    /**
     * sanitizeHTML
     * @param msg
     * @param white
     * @param black
     * @returns {*}
     */
    function sanitizeHTML(msg, white, black) {
      if (!white) white = 'b|i|p|u';//allowed tags
      if (!black) black = 'script|object|embed';//complete remove tags
      var e = new RegExp('(<(' + black + ')[^>]*>.*</\\2>|(?!<[/]?(' + white + ')(\\s[^<]*>|[/]>|>))<[^<>]*>|(?!<[^<>\\s]+)\\s[^</>]+(?=[/>]))', 'gi');
      msg = msg.replace(e, '');

      if (vm.fontStyleBold) {
        msg = '<b>' + msg + '</b>';
      }
      if (vm.fontStyleItalic) {
        msg = '<i>' + msg + '</i>';
      }

      return msg;
    }

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
     * @param uobj
     */
    vm.onUsersJoin = function (uobj) {
      vm.users.push(uobj);

      uobj.text = $translate.instant('CHAT_USER_JOIN');
      uobj.text = '*** [@' + uobj.displayName + '] ' + uobj.text;
      vm.messages.push(uobj);
    };

    /**
     * onUsersQuit
     * @param uobj
     */
    vm.onUsersQuit = function (uobj) {
      var index = -1;
      angular.forEach(vm.users, function (i, x) {
        if (i.username === uobj.username) {
          index = x;
        }
      });
      if (index >= 0) {
        vm.users.splice(index, 1);
        uobj.text = $translate.instant('CHAT_USER_QUIT');
        uobj.text = '*** [@' + uobj.displayName + '] ' + uobj.text;
        vm.messages.push(uobj);
      }
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

    /**
     * getMessageText
     * @param msg
     * @returns {*}
     */
    vm.getMessageText = function (msg) {
      var newmsg = msg.text;

      var matches = newmsg.match(/\[@(.*?)\]/g);
      angular.forEach(matches, function (m) {
        var atu = m.substr(1, m.length - 2);
        var atulink = makeAtUserLink(atu);
        newmsg = newmsg.replace(m, atulink);
      });

      return newmsg || '&nbsp;';
    };

    /**
     * makeAtUserLink
     * @param atu
     * @returns {string}
     */
    function makeAtUserLink(atu) {
      var s = '';
      s += '<a href="#" ng-click="vm.atuClicked($event)" title="' + atu + '">';
      s += atu;
      s += '</a>';
      return s;
    }

    /**
     * at user link Clicked
     * @param evt
     */
    vm.atuClicked = function (evt) {
      addAtUserToInput(' [' + evt.currentTarget.innerText + '] ');
    };

    vm.onUserListItemClicked = function (uitem) {
      addAtUserToInput(' [@' + uitem.displayName + '] ');
    };

    vm.onUserImgClicked = function (uname) {
      addAtUserToInput(' [@' + uname + '] ');
    };
    /**
     * addAtUserToInput
     * @param atu
     */
    function addAtUserToInput(atu) {
      vm.messageText += atu;
      angular.element('#messageText').trigger('focus');
    }

    /**
     * onCleanClicked
     */
    vm.onCleanClicked = function () {
      vm.messages = [];

      var m = {};
      m.type = 'status';
      m.text = $translate.instant('CHAT_MESSAGE_ALREADY_CLEAN');
      m.created = Date.now();
      m.profileImageURL = vm.user.profileImageURL;
      m.username = vm.user.username;
      m.displayName = vm.user.displayName;

      vm.messages.push(m);
    };
  }
}());
