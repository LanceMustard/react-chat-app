const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;


var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {

  socket.on('getJoinOptions', (callback) => {
    callback(users.getRoomList());
  });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    // ensure user with that name is not already in the chat room
    if (users.isUserInRoom(params.name, params.room)) {
      return callback('A user with that name already exists with this room. Please enter a unqiue name');
    }

    users.removeUser(socket.id);
    var user = users.addUser(socket.id, params.name, params.room);
    console.log(`${user.name} join ${user.room}`);
    socket.join(user.room);
    io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    // socket.leave(params.room);

    // io.emit                -> send to all                          -> io.to(params.room).emit
    // socket.broadcast.emit  -> send to all excluding  current user  -> socket.broadcast.to(params.room).emit
    // socket.emit            -> send to the current user only

    socket.emit('newMessage', generateMessage('admin', `Welcome to the ${user.room} chat room`));
    socket.broadcast.to(user.room).emit('newMessage', generateMessage('admin', `${user.name} has joined.`));
    console.log(`${user.name} connected`);
    callback(undefined, user);
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      // send to all sockets
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));

      // sends to all sockets, except the socket that initialised the event
      // socket.broadcast.emit('newMessage', {
      //   from: message.from,
      //   text: message.text,
      //   createdAt: new Date().getTime()
      // });
    }
    callback('');
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      socket.broadcast.to(user.room).emit('newMessage', generateMessage('admin', `${user.name} has left.`));
      console.log(`${user.name} disconnected`);
    }    
  });
});

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};