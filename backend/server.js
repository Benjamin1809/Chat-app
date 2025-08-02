const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET','POST'] }
});

const users = new Map();

function generateUsername() {
const minLen = 5;
  const maxLen = 20;
  const length = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let username = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    username += chars.charAt(idx);
  }
  return username;
}

io.on('connection', socket => {
  const username = generateUsername();
  users.set(socket.id, username);
  socket.emit('user-assigned', { id: socket.id, username });
  io.emit('users-list', Array.from(users.values()));
  socket.broadcast.emit('user-joined', username);
  socket.on('send-message', ({ text }) => {
    io.emit('new-message', {
      username,
      text,
      timestamp: new Date()
    });
  });
  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('user-left', username);
    io.emit('users-list', Array.from(users.values()));
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server sluša na portu ${PORT}`));