import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Learning.css';

const CATEGORIES = [
  { id: 'all', label: '🌟 Все' },
  { id: 'programming', label: '💻 Программирование' },
  { id: 'math', label: '📐 Математика' },
  { id: 'english', label: '🇬🇧 Английский' },
  { id: 'business', label: '💼 Бизнес' },
  { id: 'science', label: '🔬 Наука' },
  { id: 'tests', label: '✍️ Тесты (IELTS/SAT/ОРТ)' },
];

const RESOURCES = [
  // Программирование
  { id: 1, category: 'programming', title: 'CS50 — Harvard', desc: 'Лучший бесплатный курс по основам программирования от Гарварда', url: 'https://cs50.harvard.edu', icon: '🎓', type: 'Бесплатно', level: 'Начинающий', lang: 'EN' },
  { id: 2, category: 'programming', title: 'freeCodeCamp', desc: 'Полный курс веб-разработки, сертификаты, проекты', url: 'https://freecodecamp.org', icon: '💻', type: 'Бесплатно', level: 'Начинающий', lang: 'EN' },
  { id: 3, category: 'programming', title: 'LeetCode', desc: 'Практика алгоритмов и задач для подготовки к техническим интервью', url: 'https://leetcode.com', icon: '🧩', type: 'Freemium', level: 'Средний', lang: 'EN' },
  { id: 4, category: 'programming', title: 'Coursera — Python', desc: 'Python от University of Michigan — популярный курс с сертификатом', url: 'https://coursera.org/learn/python', icon: '🐍', type: 'Бесплатно', level: 'Начинающий', lang: 'EN' },
  { id: 5, category: 'programming', title: 'The Odin Project', desc: 'Полная программа full-stack разработки, полностью бесплатно', url: 'https://theodinproject.com', icon: '⚔️', type: 'Бесплатно', level: 'Начинающий', lang: 'EN' },
  { id: 6, category: 'programming', title: 'Kaggle Learn', desc: 'Машинное обучение и Data Science — практические курсы', url: 'https://kaggle.com/learn', icon: '📊', type: 'Бесплатно', level: 'Средний', lang: 'EN' },

  // Математика
  { id: 7, category: 'math', title: 'Khan Academy — Math', desc: 'Полная программа математики от школы до университета, бесплатно', url: 'https://khanacademy.org/math', icon: '📐', type: 'Бесплатно', level: 'Все уровни', lang: 'EN/RU' },
  { id: 8, category: 'math', title: '3Blue1Brown', desc: 'Визуальное объяснение линейной алгебры, матанализа, вероятности', url: 'https://youtube.com/@3blue1brown', icon: '🟦', type: 'Бесплатно', level: 'Средний', lang: 'EN' },
  { id: 9, category: 'math', title: 'Brilliant.org', desc: 'Интерактивные курсы по математике, физике, CS', url: 'https://brilliant.org', icon: '✨', type: 'Freemium', level: 'Все уровни', lang: 'EN' },
  { id: 10, category: 'math', title: 'MIT OpenCourseWare — Math', desc: 'Лекции MIT по математике — линейная алгебра, дифференциальные уравнения', url: 'https://ocw.mit.edu/courses/mathematics', icon: '🏛️', type: 'Бесплатно', level: 'Продвинутый', lang: 'EN' },

  // Английский
  { id: 11, category: 'english', title: 'IELTS.org — Official', desc: 'Официальный сайт IELTS с пробными тестами и материалами', url: 'https://ielts.org', icon: '🇬🇧', type: 'Бесплатно', level: 'Все уровни', lang: 'EN' },
  { id: 12, category: 'english', title: 'Duolingo English', desc: 'Ежедневная практика английского, геймификация', url: 'https://duolingo.com', icon: '🦜', type: 'Freemium', level: 'Начинающий', lang: 'RU' },
  { id: 13, category: 'english', title: 'BBC Learning English', desc: 'Официальный ресурс BBC для изучения английского', url: 'https://bbc.co.uk/learningenglish', icon: '📺', type: 'Бесплатно', level: 'Средний', lang: 'EN' },
  { id: 14, category: 'english', title: 'Anki — Flashcards', desc: 'Приложение для запоминания слов через интервальное повторение', url: 'https://apps.ankiweb.net', icon: '🃏', type: 'Бесплатно', level: 'Все уровни', lang: 'EN/RU' },
  { id: 15, category: 'english', title: 'Cambly', desc: 'Разговорный английский с носителями языка онлайн', url: 'https://cambly.com', icon: '🎙️', type: 'Платно', level: 'Средний', lang: 'EN' },

  // Бизнес
  { id: 16, category: 'business', title: 'Coursera — Business Foundations', desc: 'Программа Wharton School по основам бизнеса', url: 'https://coursera.org/specializations/wharton-business-foundations', icon: '🏦', type: 'Freemium', level: 'Начинающий', lang: 'EN' },
  { id: 17, category: 'business', title: 'Harvard Business Review', desc: 'Статьи и кейсы от лучших бизнес-умов мира', url: 'https://hbr.org', icon: '📰', type: 'Freemium', level: 'Продвинутый', lang: 'EN' },
  { id: 18, category: 'business', title: 'Y Combinator Startup School', desc: 'Бесплатная программа по созданию стартапа от YC', url: 'https://startupschool.org', icon: '🚀', type: 'Бесплатно', level: 'Средний', lang: 'EN' },
  { id: 19, category: 'business', title: 'Khan Academy — Economics', desc: 'Макро и микроэкономика, финансы — доступно и бесплатно', url: 'https://khanacademy.org/economics-finance-domain', icon: '📈', type: 'Бесплатно', level: 'Начинающий', lang: 'EN/RU' },

  // Наука
  { id: 20, category: 'science', title: 'Khan Academy — Science', desc: 'Биология, химия, физика — полная школьная и вузовская программа', url: 'https://khanacademy.org/science', icon: '🔬', type: 'Бесплатно', level: 'Все уровни', lang: 'EN/RU' },
  { id: 21, category: 'science', title: 'Coursera — Biology', desc: 'Молекулярная биология от Duke University', url: 'https://coursera.org/learn/molecular-biology', icon: '🧬', type: 'Freemium', level: 'Средний', lang: 'EN' },
  { id: 22, category: 'science', title: 'Osmosis — Medicine', desc: 'Видео и материалы по медицине и биологии', url: 'https://osmosis.org', icon: '🩺', type: 'Freemium', level: 'Средний', lang: 'EN' },
  { id: 23, category: 'science', title: 'PhET Simulations', desc: 'Интерактивные симуляции по физике, химии, математике от University of Colorado', url: 'https://phet.colorado.edu', icon: '⚗️', type: 'Бесплатно', level: 'Начинающий', lang: 'EN/RU' },

  // Тесты
  { id: 24, category: 'tests', title: 'IELTS Practice Tests', desc: 'Официальные пробные тесты IELTS онлайн', url: 'https://ielts.org/take-a-test/preparation-resources', icon: '📝', type: 'Бесплатно', level: 'Все уровни', lang: 'EN' },
  { id: 25, category: 'tests', title: 'Khan Academy — SAT Prep', desc: 'Официальная подготовка к SAT в партнёрстве с College Board', url: 'https://khanacademy.org/sat', icon: '🎯', type: 'Бесплатно', level: 'Средний', lang: 'EN' },
  { id: 26, category: 'tests', title: 'ОРТ — официальный сайт', desc: 'Пробные тесты и материалы для подготовки к ОРТ Кыргызстана', url: 'https://nce.gov.kg', icon: '🇰🇬', type: 'Бесплатно', level: 'Все уровни', lang: 'RU/KG' },
  { id: 27, category: 'tests', title: 'TOEFL Resources', desc: 'Официальные материалы для подготовки к TOEFL', url: 'https://ets.org/toefl/test-takers/ibt/prepare', icon: '📋', type: 'Бесплатно', level: 'Средний', lang: 'EN' },
  { id: 28, category: 'tests', title: 'Magoosh IELTS', desc: 'Подготовка к IELTS с видеоуроками и практикой', url: 'https://magoosh.com/ielts', icon: '📚', type: 'Freemium', level: 'Средний', lang: 'EN' },
];

const TYPE_COLORS = {
  'Бесплатно': { bg: '#064e3b', color: '#34d399', border: '#065f46' },
  'Freemium': { bg: '#1e3a5f', color: '#60a5fa', border: '#1e40af' },
  'Платно': { bg: '#3b1f1f', color: '#f87171', border: '#7f1d1d' },
};

export default function Learning() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = RESOURCES.filter(r => {
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    const matchSearch = search === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="learn-container">
      <div className="learn-header">
        <button className="learn-back" onClick={() => navigate('/chat')}>← Назад</button>
        <div className="learn-logo">
          <span>Aivora</span><span className="dot">.</span>
        </div>
      </div>

      <div className="learn-hero">
        <h1>📚 Центр обучения</h1>
        <p>Лучшие бесплатные ресурсы для подготовки к поступлению в топ университеты</p>
        <div className="learn-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Найти курс, тест, ресурс..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="learn-categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="learn-content">
        <div className="learn-count">{filtered.length} ресурсов найдено</div>
        <div className="learn-grid">
          {filtered.map(r => {
            const typeStyle = TYPE_COLORS[r.type] || TYPE_COLORS['Freemium'];
            return (
              <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="learn-card">
                <div className="learn-card-top">
                  <div className="learn-icon">{r.icon}</div>
                  <div className="learn-badges">
                    <span className="learn-badge" style={{
                      background: typeStyle.bg,
                      color: typeStyle.color,
                      border: `1px solid ${typeStyle.border}`
                    }}>{r.type}</span>
                    <span className="learn-badge lang">{r.lang}</span>
                  </div>
                </div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
                <div className="learn-card-footer">
                  <span className="learn-level">📊 {r.level}</span>
                  <span className="learn-link">Открыть →</span>
                </div>
              </a>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="learn-empty">
            <p>😔 Ничего не найдено</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all'); }}>
              Сбросить фильтры
            </button>
          </div>
        )}

        <div className="learn-ai-cta">
          <div className="learn-ai-cta-content">
            <div className="learn-ai-icon">🤖</div>
            <div>
              <h3>Не знаешь с чего начать?</h3>
              <p>AI советник Aivora поможет составить персональный план обучения именно для тебя</p>
            </div>
          </div>
          <button onClick={() => navigate('/chat')}>
            Спросить AI →
          </button>
        </div>
      </div>
    </div>
  );
}