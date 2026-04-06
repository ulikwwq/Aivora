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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
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
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
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

  const handleInput = (e) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  const handleReset = async () => {
    await resetChat();
    setMessages([
      { role: 'assistant', content: 'Привет! Я Aivora — твой AI советник по университетам. Расскажи мне о себе — чем ты интересуешься?' }
    ]);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="chat-root">

      {/* Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="brand-text">Aivora</span><span className="brand-dot">.</span>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="sidebar-user-card">
          <div className="user-ava">{name[0].toUpperCase()}</div>
          <div>
            <div className="user-label">Привет,</div>
            <div className="user-name-text">{name}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={handleReset}>
            <span className="nav-icon">✦</span>
            Новый диалог
          </button>
          <button className="nav-item" onClick={() => { navigate('/recommendations'); setSidebarOpen(false); }}>
            <span className="nav-icon">🎓</span>
            Университеты
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item danger" onClick={handleLogout}>
            <span className="nav-icon">↩</span>
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="chat-main">

        {/* Header */}
        <header className="chat-header">
          <button className="header-btn" onClick={() => setSidebarOpen(true)}>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>

          <div className="header-logo">
            <span className="brand-text">Aivora</span><span className="brand-dot">.</span>
          </div>

          <div className="header-status">
            <span className="status-dot"></span>
          </div>
        </header>

        {/* Messages */}
        <div className="messages-area">
          {messages.map((msg, i) => (
            <div key={i} className={`msg-row ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="ai-ava">A</div>
              )}
              <div className="bubble">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="msg-row assistant">
              <div className="ai-ava">A</div>
              <div className="bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="input-bar">
          <div className="input-pill">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Написать сообщение…"
              rows={1}
            />
            <button
              className={`send-btn ${input.trim() && !loading ? 'active' : ''}`}
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 14V2M2 8l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}