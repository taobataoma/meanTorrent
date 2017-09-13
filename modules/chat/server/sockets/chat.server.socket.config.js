'use strict';

// Create the chat configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  io.emit('join', {
    type: 'status',
    created: Date.now(),
    user: socket.request.user
  });

  //new client, add it to the list
  console.info('New chat client connected (id=' + socket.id + ').');
  io.chatClients.push(socket);

  var us = getUsersList();

  function getUsersList() {
    var us = [];
    io.chatClients.forEach(function (socket) {
      us.push(socket.request.user);
    });

    //mtDebug.debugGreen(us);
    return us;
  }

  // Emit the users list to the current connected user
  socket.emit('usersList', us);

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.user = socket.request.user;

    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);
  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('ban', function (message) {
    if (socket.request.user.isOper) {
      io.chatClients.forEach(function (bsocket) {
        if (bsocket.request.user.username === message.username) {
          message.type = 'status';
          message.created = Date.now();
          message.user = bsocket.request.user;
          message.text = message.by.reason || 'you are not grateful';

          message.by.user = socket.request.user;
          // Emit the 'chatMessage' event
          io.emit('ban', message);

          //add to ban list
          var address = bsocket.handshake.address;
          var buser = {
            user: bsocket.request.user,
            ip: address,
            expires: Date.now() + parseInt((message.by.expires || 60 * 60 * 1000 * 1), 10)
          };
          io.banClients.push(buser);
          //disconnect user
          bsocket.disconnect();
        }
      });
    }
  });

  // When socket disconnects, remove it from the list
  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    var index = io.chatClients.indexOf(socket);
    if (index !== -1) {
      io.chatClients.splice(index, 1);
      console.info('Client disconnect (id=' + socket.id + ').');
    }

    io.emit('quit', {
      type: 'status',
      created: Date.now(),
      user: socket.request.user
    });
  });
};
