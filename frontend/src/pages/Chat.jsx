import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessage, resetChat, saveSession, getHistory, deleteSession } from '../services/api';
import './Chat.css';

export default function Chat() {
  const [messages, setMessages] = useState(() => {
    const context = localStorage.getItem('chatContext');
    if (context) {
      const uni = JSON.parse(context);
      localStorage.removeItem('chatContext');
      return [{
        role: 'assistant',
        content: `Привет! Я вижу что тебя интересует **${uni.university}** (${uni.country}) 🎓\n\nЯ помогу тебе подготовиться к поступлению! Специальности: ${uni.specialties.join(', ')}.\n\nС чего начнём?\n1️⃣ Составить план подготовки\n2️⃣ Узнать про требования и тесты\n3️⃣ Подобрать учебные материалы`
      }];
    }
    return [{
      role: 'assistant',
      content: 'Привет! Я Aivora — твой AI советник по университетам. Расскажи мне о себе — чем ты интересуешься?'
    }];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);     // переименовано из sidebarOpen
  const [sessionId, setSessionId] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const name = localStorage.getItem('name') || 'Пользователь';

  // Проверка авторизации и загрузка истории при монтировании
  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
    loadHistory();
  }, [navigate]);

  // Загрузка списка сессий с сервера
  const loadHistory = async () => {
    try {
      const res = await getHistory();
      setHistory(res.data);
    } catch (err) {
      console.error('Ошибка загрузки истории:', err);
    }
  };

  // Открытие сохранённого чата
  const openSession = (session) => {
    try {
      // Если messages приходит как строка JSON, парсим, иначе используем как есть
      const msgs = typeof session.messages === 'string' 
        ? JSON.parse(session.messages) 
        : session.messages;
      setMessages(msgs);
      setSessionId(session.id);
      setHistoryOpen(false);
      setMenuOpen(false);
    } catch (err) {
      console.error('Ошибка загрузки сессии:', err);
    }
  };

  // Отправка сообщения
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    // Оптимистичное обновление: добавляем сообщение пользователя
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const uniContext = localStorage.getItem('pendingUniContext');
      if (uniContext) localStorage.removeItem('pendingUniContext');
      const res = await sendMessage(userMsg, uniContext);
      const finalMessages = [...newMessages, { role: 'assistant', content: res.data.reply }];
      setMessages(finalMessages);
      // Автосохранение после получения ответа AI
      const title = newMessages.find(m => m.role === 'user')?.content?.slice(0, 40) || 'Новый чат';
      const saveRes = await saveSession({ sessionId, title, messages: finalMessages });
      if (!sessionId) setSessionId(saveRes.data.id);
      await loadHistory(); // обновляем боковую панель истории
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ошибка соединения. Попробуй снова.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Сброс текущего диалога (новый чат)
  const handleReset = async () => {
    await resetChat();
    setSessionId(null);
    setMessages([{
      role: 'assistant',
      content: 'Привет! Я Aivora — твой AI советник по университетам. Расскажи мне о себе — чем ты интересуешься?'
    }]);
    setMenuOpen(false);
    setHistoryOpen(false);
  };

  // Выход из аккаунта
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Обработчики ввода
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

  // Автоскролл
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-root">
      {/* Оверлей для бокового меню */}
      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Боковое меню (sidebar) */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="brand-text">Aivora</span><span className="brand-dot">.</span>
          </div>
          <button className="sidebar-close" onClick={() => setMenuOpen(false)}>✕</button>
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
          <button className="nav-item" onClick={() => { navigate('/recommendations'); setMenuOpen(false); }}>
            <span className="nav-icon">🎓</span>
            Университеты
          </button>
          <button className="nav-item" onClick={() => { navigate('/learning'); setMenuOpen(false); }}>
            <span className="nav-icon">📚</span>
            Обучение
          </button>
          <button className="nav-item" onClick={() => setHistoryOpen(!historyOpen)}>
            <span className="nav-icon">🕐</span>
            История чатов
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item danger" onClick={handleLogout}>
            <span className="nav-icon">↩</span>
            Выйти
          </button>
        </div>
      </aside>

      {/* Панель истории (отдельный слой) */}
      {historyOpen && (
        <>
          <div className="history-overlay" onClick={() => setHistoryOpen(false)} />
          <div className="history-panel">
            <div className="history-header">
              <h3>История чатов</h3>
              <button onClick={() => setHistoryOpen(false)}>✕</button>
            </div>
            <div className="history-list">
              {history.length === 0 && (
                <p className="history-empty">Нет сохранённых чатов</p>
              )}
              {history.map((s) => (
                <div key={s.id} className="history-item" onClick={() => openSession(s)}>
                  <div className="history-item-content">
                    <span className="history-title">{s.title}</span>
                    <span className="history-date">
                      {new Date(s.updatedAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <button
                    className="history-delete"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await deleteSession(s.id);
                      await loadHistory();
                      if (sessionId === s.id) handleReset(); // если удалили текущий чат, сбросим
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Основная область чата */}
      <div className="chat-main">
        <header className="chat-header">
          <button className="header-btn" onClick={() => setMenuOpen(true)}>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>
          <div className="header-logo">
            <span className="brand-text">Aivora</span><span className="brand-dot">.</span>
          </div>
        </header>

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