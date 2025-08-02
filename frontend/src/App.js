import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const endRef = useRef();

  // 1) Prijem početnih podataka i postavljanje listenera
  useEffect(() => {
    socket.on('user-assigned', u => {
      setUser(u);
    });
    socket.on('users-list', list => {
      setUsers(list);
    });
    socket.on('user-joined', username => {
      setMessages(m => [...m, { system: true, text: `${username} joined the chat` }]);
    });
    socket.on('user-left', username => {
      setMessages(m => [...m, { system: true, text: `${username} left the chat` }]);
    });
    socket.on('new-message', msg => {
      setMessages(m => [...m, msg]);
    });

    return () => {
      socket.off('user-assigned');
      socket.off('users-list');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('new-message');
    };
  }, []);

  // 2) Scrollaj dolje kad stigne nova poruka
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3) Slanje poruke
  const sendMessage = e => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    socket.emit('send-message', { text: newMessage });
    setNewMessage('');
  };

  if (!user) {
    return <div className="loading">Connecting…</div>;
  }

  return (
    <div className="app-container">
      {/* Sidebar sa listom aktivnih korisnika */}
      <aside className="sidebar">
        <h3>Active Users ({users.length})</h3>
        <ul>
          {users.map(u => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </aside>

      {/* Glavni chat */}
      <main className="chat-main">
        <div className="messages">
          {messages.map((m, i) =>
            m.system ? (
              <div key={i} className="message system">
                <em>{m.text}</em>
              </div>
            ) : (
              <div
                key={i}
                className={`message ${m.username === user.username ? 'own' : ''}`}
              >
                <div className="meta">
                  <span className="user">{m.username}</span>{' '}
                  <span className="time">
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text">{m.text}</div>
              </div>
            )
          )}
          <div ref={endRef} />
        </div>

        <form className="input-area" onSubmit={sendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your message…"
            maxLength={500}
          />
          <button type="submit" disabled={!newMessage.trim()}>
            Send
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
