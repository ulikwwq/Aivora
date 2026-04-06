import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessage, resetChat } from '../services/api';
import './Chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Привет! Я Aivora — твой AI советник по университетам. Расскажи мне о себе — чем ты интересуешься?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const name = localStorage.getItem('name') || 'Пользователь';

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const res = await sendMessage(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ошибка соединения. Попробуй снова.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = async () => {
    await resetChat();
    setMessages([
      { role: 'assistant', content: 'Привет! Я Aivora — твой AI советник по университетам. Расскажи мне о себе — чем ты интересуешься?' }
    ]);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="chat-container">

      {/* Мобильный хедер */}
      <div className="mobile-header">
        <div className="mobile-logo">
          <span className="logo-text">Aivora</span><span className="logo-dot">.</span>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-user">
            <div className="user-avatar">{name[0].toUpperCase()}</div>
            <span>{name}</span>
          </div>
          <button className="mobile-menu-btn" onClick={handleReset}>+ Новый диалог</button>
          <button className="mobile-menu-btn logout" onClick={handleLogout}>Выйти</button>
        </div>
      )}

      {/* Десктоп sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">Aivora</span><span className="logo-dot">.</span>
        </div>
        <div className="sidebar-user">
          <div className="user-avatar">{name[0].toUpperCase()}</div>
          <span className="user-name">{name}</span>
        </div>
        <button className="btn-new-chat" onClick={handleReset}>+ Новый диалог</button>
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h3>AI Советник</h3>
          <span className="status-dot"></span>
          <span className="status-text">Онлайн</span>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.role === 'assistant' && <div className="avatar-ai">A</div>}
              <div className="message-bubble">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <div className="avatar-ai">A</div>
              <div className="message-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напиши сообщение..."
            rows={1}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}>➤</button>
        </div>
      </div>
    </div>
  );
}