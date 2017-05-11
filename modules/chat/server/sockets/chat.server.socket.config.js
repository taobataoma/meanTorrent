'use strict';

// Create the chat configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  io.emit('join', {
    type: 'status',
    created: Date.now(),
    profileImageURL: socket.request.user.profileImageURL,
    username: socket.request.user.username,
    displayName: socket.request.user.displayName
  });

  //new client, add it to the list
  console.info('New chat client connected (id=' + socket.id + ').');
  io.chatClients.push(socket);

  var us = getUsersList();

  function getUsersList() {
    var us = [];
    io.chatClients.forEach(function (socket) {
      var s = {};
      s.profileImageURL = socket.request.user.profileImageURL;
      s.username = socket.request.user.username;
      s.displayName = socket.request.user.displayName;

      us.push(s);
    });

    return us;
  }

  // Emit the users list to the current connected user
  socket.emit('usersList', us);

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;
    message.displayName = socket.request.user.displayName;

    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);
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
      profileImageURL: socket.request.user.profileImageURL,
      username: socket.request.user.username,
      displayName: socket.request.user.displayName
    });
  });
};
