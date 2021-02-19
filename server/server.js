const express = require('express');
const http = require('http');
const cors = require('cors')
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const CryptoJS = require("crypto-js");
const AES = require("crypto-js/aes");
const { addUser, removeUser, getUser, getUsersInRoom, getAllUsers } = require('./utils/chatUsers')

const { SERVER_PORT } = require('./constants/config.js');
const routes = require('./routes');

const { urlencoded, json } = bodyParser;

const port = process.env.port || SERVER_PORT;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  wsEngine: 'ws',
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(routes);

io.on('connection', socket => {
  socket.on('join', (users, callback) => {


    const sortedIds = [users.currentUser._id, users.user._id].sort();
    let roomId = '';
    if (sortedIds[0], sortedIds[1]) {
      roomId = CryptoJS.HmacSHA1(sortedIds[0], sortedIds[1]).toString();
      const { error, result } = addUser(users.currentUser, roomId)

      console.log(users.currentUser, roomId)
      if (error) {
        return callback(error);
      }
    }

    socket.emit('message', { fromMe: 'admin', user: users.currentUser._id, text: `${users.currentUser.firstName}, wellcome to chat with ${users.user.firstName}` });
    socket.broadcast.to(roomId).emit('message', { fromMe: 'admin', text: `${users.currentUser.firstName}, is active` });

    socket.join(roomId);

    callback();
  })

  socket.on('sendMessage', (message, userId, callback) => {
    const user = getUser(userId);

    if (user) {
      io.to(user.roomId).emit('message', { from: user._id, firstName: user.firstName, text: message })
    }

    callback();
  });

  socket.on('disconnected', (userId, callback) => {
    //const user = getUser(userId);
    console.log(userId);
    removeUser(userId);

    callback()
  })
});

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

