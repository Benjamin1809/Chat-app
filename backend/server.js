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
const messages = [];
const privateChats = new Map();

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
  users.set(socket.id, { id: socket.id, username, joinedAt: new Date() });
  socket.emit('user-assigned', { id: socket.id, username });
  socket.emit('message-history', messages);
  io.emit('users-list', Array.from(users.values()));
  socket.broadcast.emit('user-joined', { username, timestamp: new Date() });
  socket.on('send-message', data => {
    const user = users.get(socket.id);
    if (!user) return;
    const msg = {
      id: Date.now(),
      username: user.username,
      text: data.text,
      timestamp: new Date(),
      type: 'global'
    };
    messages.push(msg);
    if (messages.length > 100) messages.shift();
    io.emit('new-message', msg);
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      socket.broadcast.emit('user-left', { username: user.username, timestamp: new Date() });
      io.emit('users-list', Array.from(users.values()));
    }
  });


 socket.on('start-private-chat', data => {
    const userA = users.get(socket.id);
    const userB = users.get(data.targetUserId);
    if (!userA || !userB) return;
    const chatId = [socket.id, data.targetUserId].sort().join('-');
    if (!privateChats.has(chatId))  privateChats.set(chatId, []);
    socket.join(chatId);
    io.sockets.sockets.get(data.targetUserId)?.join(chatId);
    io.to(chatId).emit('private-chat-started', {
      chatId,
      participants: [userA, userB],
      messages: privateChats.get(chatId)
    });
  });

  socket.on('send-private-message', data => {
    const user = users.get(socket.id);
    if (!user) return;
    const msg = {
      id: Date.now(),
      username: user.username,
      text: data.text,
      timestamp: new Date(),
      type: 'private',
      chatId: data.chatId
    };
    const arr = privateChats.get(data.chatId) || [];
    arr.push(msg);
    privateChats.set(data.chatId, arr);
    io.to(data.chatId).emit('new-private-message', msg);

  });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server sluša na portu ${PORT}`));