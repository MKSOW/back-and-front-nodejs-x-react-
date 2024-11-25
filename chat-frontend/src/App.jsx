import './App.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Chat from './pages/chat/Chat';   
import ProtectedRoute from './utils/ProtectedRoute';

const socket = io('http://localhost:4001'); // Met à jour avec l'URL de ton serveur

function App() {
  const [name, setName] = useState('anonymous');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [clientsTotal, setClientsTotal] = useState(0);
  const [users, setUsers] = useState({});
  const [recipientId, setRecipientId] = useState('All');
  const [conversations, setConversations] = useState({ All: [] });
  const [isCooldown, setIsCooldown] = useState(false);
  const [isNotificationSent, setIsNotificationSent] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    // Écouter le message de bienvenue envoyé par le serveur
    socket.on('welcome', (message) => {
      setWelcomeMessage(message);
    });

    socket.on('setUsername', (username) => {
      const currentTime = new Date().toLocaleString();
      const welcomeMessage = `Bienvenue, ${username} ! Heure de connexion : ${currentTime}`;
      socket.emit('welcome', welcomeMessage);
    });

    return () => {
      socket.off('welcome');
      socket.off('setUsername');
    };
  }, []);

  const afficherNotification = (message) => {
    const notificationsContainer = document.getElementById('notifications');
    const notifElement = document.createElement('div');
    notifElement.className = 'notification';
    notifElement.textContent = message;
    notificationsContainer.appendChild(notifElement);

    setTimeout(() => {
      notifElement.remove();
    }, 5000);
  };

  useEffect(() => {
    socket.on('notification', (notification) => {
      if (!isNotificationSent && notification) {
        afficherNotification(notification);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: notification, author: 'Système', date: new Date().toLocaleString() }
        ]);
        setIsNotificationSent(true);

        setTimeout(() => {
          setIsNotificationSent(false);
        }, 5000);
      }
    });

    return () => {
      socket.off('notification');
    };
  }, [isNotificationSent]);

  useEffect(() => {
    socket.emit('setUsername', name);

    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setConversations((prevConversations) => ({
        ...prevConversations,
        All: [...prevConversations.All, newMessage],
      }));
    });

    socket.on('privateMessage', (newMessage) => {
      const recipientKey = newMessage.senderId === socket.id ? newMessage.recipientId : newMessage.senderId;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setConversations((prevConversations) => ({
        ...prevConversations,
        [recipientKey]: [...(prevConversations[recipientKey] || []), newMessage],
      }));
    });

    socket.on('typing', ({ recipientId: typingRecipientId, feedback }) => {
      setFeedback(feedback);
    });

    socket.on('clientsTotal', (totalClients) => {
      setClientsTotal(totalClients);
    });

    socket.on('updateUserList', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off('message');
      socket.off('privateMessage');
      socket.off('typing');
      socket.off('clientsTotal');
      socket.off('updateUserList');
    };
  }, [name, recipientId]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    socket.emit('setUsername', e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== '' && !isCooldown) {
      const newMessage = {
        text: message,
        author: name,
        date: new Date().toLocaleString(),
        senderId: socket.id,
        recipientId: recipientId === 'All' ? 'All' : recipientId,
      };
      socket.emit('message', newMessage);
      setMessage('');
      setFeedback('');
      socket.emit('stopTyping', recipientId);

      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
    }
  };

  let typingTimeout;

  const handleTyping = () => {
    if (typingTimeout) clearTimeout(typingTimeout);

    socket.emit('typing', {
      recipientId,
      feedback: `${name} est en train d'écrire...`,
    });

    typingTimeout = setTimeout(() => {
      socket.emit('stopTyping', recipientId);
    }, 2000);
  };

  const handleRecipientClick = (id) => {
    setRecipientId(id);
    setFeedback('');
  };


  const currentMessages = conversations[recipientId] || [];

  return (

    <>
          <Router>
<nav className="navbar">
        {!isAuthenticated && <Link to="/register">Register</Link>}
        {!isAuthenticated && <Link to="/login">Login</Link>}
        {isAuthenticated && <Link to="/chat">Chat</Link>}
        {isAuthenticated && (
          <a onClick={handleLogout} className="logout-button">
            Logout
          </a>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
      <h1 className="title">☕ iChat</h1>
      <div className="fullBody">
        <div className="main flex">
          <div className="userList">
            <h3>Users:</h3>
            <ul>
              <li
                key="All"
                onClick={() => handleRecipientClick('All')}
                className={recipientId === 'All' ? 'selectedUser' : ''}
              >
                All
              </li>
              {Object.keys(users).map(
                (id) =>
                  id !== socket.id && (
                    <li
                      key={id}
                      onClick={() => handleRecipientClick(id)}
                      className={id === recipientId ? 'selectedUser' : ''}
                    >
                      {users[id]}
                    </li>
                  )
              )}
            </ul>
          </div>
          <div className="conversation">
            <div className="name">
              <span className="flex">
                <FontAwesomeIcon icon={faUser} />
                <input
                  type="text"
                  className="nameInput"
                  id="nameInput"
                  value={name}
                  onChange={handleNameChange}
                  maxLength="20"
                />
              </span>
            </div>
            <ul className="messageContainer" id="messageContainer">
              {currentMessages.map((msg, index) => (
                <li
                  key={index}
                  className={
                    msg.author === 'Système' ? 'notificationMessage' :
                    msg.senderId === socket.id ? 'messageRight' : 'messageLeft'
                  }
                >
                  <p className="message">{msg.text}</p>
                  <span>{msg.author} - {msg.date}</span>
                </li>
              ))}
              {feedback && (
                <li className="messageFeedback">
                  <p className="feedback" id="feedback">
                    {feedback}
                  </p>
                </li>
              )}
            </ul>

            <form
              className="messageForm"
              id="messageForm"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="message"
                id="messageInput"
                className="messageInput"
                value={message}
                onChange={handleMessageChange}
                onKeyUp={handleTyping}
              />
              <div className="verticalDivider"></div>
              <button type="submit" className="sendButton" disabled={isCooldown}>
                Send
                <span>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </span>
              </button>
            </form>
            <center><h3 className="clientsTotal" id="ClientTotal">
              Total Clients: {clientsTotal}
            </h3></center>
            
            {/* Conteneur de notifications */}
            <div id="notifications" style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}></div>
              <div>
                {welcomeMessage &&  <center><p style={{ color: 'green', fontWeight: 'bold' }}>{welcomeMessage}</p></center> }
                {/* Reste de l'interface */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
