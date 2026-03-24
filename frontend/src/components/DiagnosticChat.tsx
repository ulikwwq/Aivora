import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { CHAT_SCRIPT } from '../data/mockData';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  options?: string[];
}

const DiagnosticChat: React.FC = () => {
  const { setCurrentView, setUserProfile, userProfile } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start the chat by adding the first question after a short delay
    const timer = setTimeout(() => {
      setMessages([{
        id: CHAT_SCRIPT[0].id,
        sender: 'ai',
        text: CHAT_SCRIPT[0].text,
        options: CHAT_SCRIPT[0].options
      }]);
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll to bottom every time messages update
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleOptionSelect = (optionText: string) => {
    // Add User response
    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: optionText
    };
    
    // Remove options from the previous AI message so they can't be clicked again
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1].options = undefined;
      }
      return [...newMessages, newUserMsg];
    });

    // Determine strengths based on answers in a simplified way for MVP
    setUserProfile(prev => {
      const newStrengths = [...prev.strengths];
      if (optionText.includes('программировать') || optionText.includes('Технарь')) newStrengths.push('Техническое мышление');
      if (optionText.includes('Общаться') || optionText.includes('помогать')) newStrengths.push('Коммуникабельность');
      if (optionText.includes('Рисовать') || optionText.includes('творчески')) newStrengths.push('Креативность');
      if (optionText.includes('Аналитик') || optionText.includes('Обожаю!')) newStrengths.push('Аналитический склад ума');
      return { ...prev, strengths: Array.from(new Set(newStrengths)) };
    });

    setIsTyping(true);

    // Proceed to next question or finish
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < CHAT_SCRIPT.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: CHAT_SCRIPT[nextIndex].id,
          sender: 'ai',
          text: CHAT_SCRIPT[nextIndex].text,
          options: CHAT_SCRIPT[nextIndex].options
        }]);
        setCurrentQuestionIndex(nextIndex);
        setIsTyping(false);
      }, 1500); // Mocks AI thinking time
    } else {
      setTimeout(async () => {
        setMessages(prev => [...prev, {
          id: 'finish',
          sender: 'ai',
          text: 'Спасибо за твои ответы! Я анализирую твои данные...'
        }]);

        try {
          const res = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              messages: messages, 
              userProfile: userProfile
            })
          });

          if (res.ok) {
            const data = await (res.json() as Promise<{
              strengths: string[];
              recommendedProfessions: any[];
              recommendedUniversities: any[];
            }>);
            
            setUserProfile(prev => ({ ...prev, strengths: data.strengths }));
            // Note: to truly offload we would also save professions/universities globally.
            // For MVP duration, they will be mapped in Dashboard dynamically.
          }
        } catch (error) {
          console.error("Backend unreachable", error);
        }

        setIsTyping(false);
        
        setTimeout(() => {
          setCurrentView('results');
        }, 2000);
      }, 1500);
    }
  };

  return (
    <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '800px', margin: '0 auto', width: '100%', overflow: 'hidden', height: 'calc(100vh - 8rem)' }}>
      {/* Chat header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '3rem', height: '3rem', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <Bot size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontWeight: 600 }}>Aivora Assistant</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%', display: 'inline-block' }}></span> Online
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in" style={{ 
            display: 'flex', 
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            gap: '1rem'
          }}>
            {msg.sender === 'ai' && (
              <div style={{ width: '2.5rem', height: '2.5rem', background: 'rgba(99, 102, 241, 0.1)', flexShrink: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Bot size={20} />
              </div>
            )}
            
            <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ 
                padding: '1rem', 
                borderRadius: '1.25rem',
                borderTopLeftRadius: msg.sender === 'ai' ? '0.25rem' : '1.25rem',
                borderTopRightRadius: msg.sender === 'user' ? '0.25rem' : '1.25rem',
                background: msg.sender === 'user' ? 'var(--primary)' : 'var(--surface-color)',
                color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                boxShadow: 'var(--shadow-sm)',
                border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none'
              }}>
                {msg.text}
              </div>

              {/* Options logic */}
              {msg.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {msg.options.map((opt, i) => (
                    <button 
                      key={i} 
                      className="btn btn-outline"
                      style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
                      onClick={() => handleOptionSelect(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div style={{ width: '2.5rem', height: '2.5rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', flexShrink: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <User size={20} />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', background: 'rgba(99, 102, 241, 0.1)', flexShrink: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Bot size={20} />
            </div>
            <div style={{ 
                padding: '1rem', 
                borderRadius: '1.25rem',
                borderTopLeftRadius: '0.25rem',
                background: 'var(--surface-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid var(--border-color)'
              }}>
                <span className="dot-typing"></span>
                <span className="dot-typing" style={{ animationDelay: '0.2s' }}></span>
                <span className="dot-typing" style={{ animationDelay: '0.4s' }}></span>
              </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default DiagnosticChat;
