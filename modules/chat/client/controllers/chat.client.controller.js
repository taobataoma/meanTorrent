(function () {
  'use strict';

  angular
    .module('chat')
    .controller('ChatController', ChatController);

  ChatController.$inject = ['$scope', '$state', '$timeout', 'Authentication', 'Socket', '$translate', 'ModalConfirmService', 'MeanTorrentConfig',
    'DebugConsoleService'];

  function ChatController($scope, $state, $timeout, Authentication, Socket, $translate, ModalConfirmService, MeanTorrentConfig,
                          mtDebug) {
    var vm = this;

    vm.user = Authentication.user;
    vm.chatConfig = MeanTorrentConfig.meanTorrentConfig.chat;
    vm.messages = [];
    vm.users = [];
    vm.messageText = '';
    vm.scrollAtBottom = true;

    vm.selectedFontColor = '#000';
    vm.fontColorPopover = {
      templateUrl: 'fontColor.html',
      isOpen: false
    };

    vm.colorList = [
      '#000000',
      '#000080',
      '#0000FF',
      '#6699FF',
      '#00CC00',
      '#008000',
      '#008080',
      '#800000',
      '#800080',
      '#808000',
      '#DC143C',
      '#FF1493',
      '#FF4500',
      '#FF9900',
      '#F08080',
      '#A9A9A9'
    ];

    init();

    /**
     * init all event bundle
     */
    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('authentication.signin');
      }

      registerCallback();

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
        registerCallback();
      }

      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.disconnect();
        Socket.removeListener('chatMessage');
        Socket.removeListener('usersList');
        Socket.removeListener('join');
        Socket.removeListener('quit');
        Socket.removeListener('ban');
      });
    }

    function registerCallback() {
      // add an event listener to the 'error' event
      Socket.on('error', function (err) {
        var message = {
          type: 'status',
          text: '*** ' + err
        };
        vm.messages.push(message);
      });

      // Add an event listener to the 'chatMessage' event
      Socket.on('chatMessage', function (message) {
        vm.messages.push(message);
      });

      // add an event listener to the 'usersList' event
      Socket.on('usersList', function (message) {
        vm.onUsersList(message);
      });

      // add an event listener to the 'join' event
      Socket.on('join', function (message) {
        vm.onUserJoin(message);
      });

      // add an event listener to the 'ban' event
      Socket.on('ban', function (message) {
        vm.onUserBan(message);
      });

      // add an event listener to the 'quit' event
      Socket.on('quit', function (message) {
        vm.onUserQuit(message);
      });

      // add an event listener to the 'disconnect' event
      Socket.on('disconnect', function () {
        var message = {
          type: 'status',
          text: '*** ' + $translate.instant('CHAT_DISCONNECT')
        };
        vm.messages.push(message);
      });
    }

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);
    function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
      var footer = angular.element('footer');
      var bodysize = angular.element('.bodysize');

      if (toState.name === 'chat') {
        footer.css('display', 'none');
        bodysize.css('backgroundColor', '#f1f1f1');
      } else {
        footer.css('display', 'block');
        bodysize.css('backgroundColor', '#fff');
      }
    }

    /**
     * $watch 'vm.messages'
     * when changed, scroll to bottom
     */
    $scope.$watch('vm.messages.length', function (newValue, oldValue) {
      //mtDebug.info('vm.messages changed');
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
        text: sanitizeHTML(vm.messageText),
        fontColor: vm.selectedFontColor
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
    };

    /**
     * onInputKeyDown
     * @param evt
     */
    vm.onInputKeyDown = function (evt) {
      if (evt.keyCode === 13) {
        if (evt.shiftKey) {
          return;
        } else {
          if (vm.messageText) {
            vm.sendMessage();
            //evt.stopPropagation();
            evt.preventDefault();
          }
        }
      }
    };

    /**
     * onUsersList
     * @param message(user lsit)
     */
    vm.onUsersList = function (message) {
      vm.users = message;
    };

    /**
     * onUsersJoin
     * @param message
     */
    vm.onUserJoin = function (message) {
      vm.users.push(message.user);

      message.text = $translate.instant('CHAT_USER_JOIN');
      message.text = '*** [@' + message.user.displayName + '] ' + message.text;
      vm.messages.push(message);
    };

    /**
     * onUsersQuit
     * @param message
     */
    vm.onUserQuit = function (message) {
      var index = -1;
      angular.forEach(vm.users, function (i, x) {
        if (i.username === message.user.username) {
          index = x;
        }
      });
      if (index >= 0) {
        vm.users.splice(index, 1);
        message.text = $translate.instant('CHAT_USER_QUIT');
        message.text = '*** [@' + message.user.displayName + '] ' + message.text;
        vm.messages.push(message);
      }
    };

    /**
     * onUsersBan
     * @param message
     */
    vm.onUserBan = function (message) {
      removeUserFromList(message.user.username);

      var who = '[@' + message.user.displayName + ']';
      var by = '[@' + message.by.user.displayName + ']';

      message.text = $translate.instant('CHAT_BAN_KICK_MESSAGE', {who: who, by: by, reason: message.text});

      vm.messages.push(message);
    };

    /**
     * removeUserFromList
     * @param uname
     */
    function removeUserFromList(uname) {
      angular.forEach(vm.users, function (u, index) {
        if (u.username === uname) {
          vm.users.splice(index, 1);
        }
      });
    }

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

      newmsg = newmsg.replace(/(?:\r\n|\r|\n)/g, '<br />');

      var matches = newmsg.match(/\[@(.*?)\]/g);
      angular.forEach(matches, function (m) {
        var atu = m.substr(1, m.length - 2);
        var atulink = makeAtUserLink(atu);
        newmsg = newmsg.replace(m, atulink);
      });

      if (msg.fontColor) {
        newmsg = '<font color="' + msg.fontColor + '">' + (newmsg || '&nbsp;') + '</font>';
      }

      return newmsg || '&nbsp;';
    };

    /**
     * makeAtUserLink
     * @param atu
     * @returns {string}
     */
    function makeAtUserLink(atu) {
      var s = '';
      s += '<a href="#" ng-dblclick="vm.atuDblClicked($event)" title="' + atu + '">';
      s += atu;
      s += '</a>';
      return s;
    }

    /**
     * at user link dbl Clicked
     * @param evt
     */
    vm.atuDblClicked = function (evt) {
      addAtUserToInput(' [' + evt.currentTarget.innerText + '] ');
    };

    /**
     * userlist item dbl clicked
     * @param uitem
     */
    vm.onUserListItemDblClicked = function (uitem) {
      addAtUserToInput(' [@' + uitem.displayName + '] ');
    };

    /**
     * user profile picture dbl clicked
     * @param uname
     */
    vm.onUserImgDblClicked = function (uname) {
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
      m.user = vm.user;

      vm.messages.push(m);
    };

    /**
     * banKickUser
     * @param u
     */
    vm.banKickUser = function (u) {
      var modalOptions = {
        closeButtonText: $translate.instant('CHAT_CONFIRM_BAN_CANCEL'),
        actionButtonText: $translate.instant('CHAT_CONFIRM_BAN_OK'),
        headerText: $translate.instant('CHAT_CONFIRM_BAN_HEADER_TEXT'),
        bodyText: $translate.instant('CHAT_CONFIRM_BAN_BODY_TEXT'),
        bodyParams: u.displayName
      };

      ModalConfirmService.showModal({}, modalOptions)
        .then(function (result) {
          var message = {
            username: u.username,
            text: $translate.instant('CHAT_BAN_KICK_REASON'),
            by: {
              user: vm.user,
              expires: vm.chatConfig.ban.expires
            }
          };
          Socket.emit('ban', message);
        });
    };

    /**
     * onColorItemClicked
     * @param c
     */
    vm.onColorItemClicked = function (c) {
      angular.element('#font-color-icon').css('color', c);
      angular.element('#messageText').css('color', c);

      vm.fontColorPopover.isOpen = false;
      vm.selectedFontColor = c;
      angular.element('#messageText').trigger('focus');
    };

    /**
     * onColorItemMouseEnter
     * @param c
     */
    vm.onColorItemMouseEnter = function (c) {
      angular.element('#font-color-icon').css('color', c);
      angular.element('#messageText').css('color', c);
    };

    /**
     * onColorItemMouseLeave
     * @param c
     */
    vm.onColorItemMouseLeave = function (c) {
      angular.element('#font-color-icon').css('color', vm.selectedFontColor);
      angular.element('#messageText').css('color', vm.selectedFontColor);
    };
  }
}());
