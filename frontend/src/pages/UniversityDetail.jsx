import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UniversityDetail.css';

const API_URL = 'https://aivora-backend-l8mv.onrender.com';

const RESOURCES = {
  'Computer Science': [
    { title: 'CS50 — Harvard (бесплатно)', url: 'https://cs50.harvard.edu', icon: '🎓', type: 'Курс' },
    { title: 'Python для начинающих', url: 'https://youtube.com/watch?v=rfscVS0vtbw', icon: '▶️', type: 'YouTube' },
    { title: 'LeetCode — практика алгоритмов', url: 'https://leetcode.com', icon: '💻', type: 'Практика' },
    { title: 'Coursera — Algorithms', url: 'https://coursera.org/learn/algorithms-part1', icon: '📚', type: 'Курс' },
  ],
  'AI': [
    { title: 'Fast.ai — Deep Learning', url: 'https://fast.ai', icon: '🤖', type: 'Курс' },
    { title: 'Andrew Ng — ML Course', url: 'https://coursera.org/learn/machine-learning', icon: '📚', type: 'Курс' },
    { title: '3Blue1Brown — Neural Networks', url: 'https://youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', icon: '▶️', type: 'YouTube' },
  ],
  'Business': [
    { title: 'Khan Academy — Economics', url: 'https://khanacademy.org/economics-finance-domain', icon: '📚', type: 'Бесплатно' },
    { title: 'Coursera — Business Foundations', url: 'https://coursera.org/specializations/wharton-business-foundations', icon: '🎓', type: 'Курс' },
    { title: 'Harvard Business Review', url: 'https://hbr.org', icon: '📰', type: 'Статьи' },
  ],
  'Medicine': [
    { title: 'Khan Academy — Biology', url: 'https://khanacademy.org/science/biology', icon: '🧬', type: 'Бесплатно' },
    { title: 'Osmosis — Medical Education', url: 'https://osmosis.org', icon: '🎓', type: 'Курс' },
    { title: 'Amboss — Medical Knowledge', url: 'https://amboss.com', icon: '📚', type: 'Платформа' },
  ],
  'Engineering': [
    { title: 'Khan Academy — Physics', url: 'https://khanacademy.org/science/physics', icon: '⚡', type: 'Бесплатно' },
    { title: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu', icon: '🎓', type: 'Бесплатно' },
    { title: 'Coursera — Engineering', url: 'https://coursera.org/browse/engineering', icon: '📚', type: 'Курс' },
  ],
  'Economics': [
    { title: 'Khan Academy — Macroeconomics', url: 'https://khanacademy.org/economics-finance-domain/macroeconomics', icon: '📊', type: 'Бесплатно' },
    { title: 'Coursera — Economics', url: 'https://coursera.org/browse/social-sciences/economics', icon: '📚', type: 'Курс' },
    { title: 'The Economist', url: 'https://economist.com', icon: '📰', type: 'Журнал' },
  ],
  'Law': [
    { title: 'Coursera — Introduction to Law', url: 'https://coursera.org/learn/intro-to-law', icon: '⚖️', type: 'Курс' },
    { title: 'Yale Law School — Free Courses', url: 'https://law.yale.edu', icon: '🎓', type: 'Бесплатно' },
  ],
  'Data Science': [
    { title: 'Kaggle — Data Science', url: 'https://kaggle.com/learn', icon: '📊', type: 'Бесплатно' },
    { title: 'Coursera — Data Science', url: 'https://coursera.org/specializations/jhu-data-science', icon: '📚', type: 'Курс' },
    { title: 'Towards Data Science', url: 'https://towardsdatascience.com', icon: '📰', type: 'Статьи' },
  ],
};

const TESTS = {
  'USA': ['SAT (минимум 1200+)', 'TOEFL (минимум 80+)', 'ACT (опционально)'],
  'UK': ['IELTS (минимум 6.5)', 'A-Level или IB', 'UCAS заявка'],
  'Germany': ['TestDaF или DSH (немецкий)', 'IELTS 6.0+ (для англ. программ)', 'Аттестат с переводом'],
  'Canada': ['IELTS 6.5+', 'Аттестат', 'Мотивационное письмо'],
  'Singapore': ['IELTS 6.0+', 'SAT или A-Level', 'Рекомендательные письма'],
  'Japan': ['JLPT N2+ или IELTS', 'Стипендия MEXT', 'Вступительный экзамен'],
  'South Korea': ['TOPIK Level 3+ или IELTS', 'Вступительный экзамен', 'Рекомендации'],
  'Netherlands': ['IELTS 6.5+', 'Аттестат', 'Мотивационное письмо'],
  'Australia': ['IELTS 6.5+', 'Аттестат', 'Финансовые документы'],
  'Switzerland': ['IELTS 7.0+', 'Вступительный экзамен', 'Портфолио'],
  'Russia': ['ЕГЭ (математика, профильный предмет)', 'Олимпиады', 'Внутренние вступительные'],
  'Kazakhstan': ['ЕНТ или SAT', 'IELTS 6.0+', 'Конкурс на стипендию'],
  'Kyrgyzstan': ['ОРТ', 'Аттестат', 'Внутренние экзамены вуза'],
  'Uzbekistan': ['SAT или внутренний экзамен', 'IELTS 5.5+', 'Аттестат'],
};

const TIMELINE = [
  { month: '1-2 месяца', task: 'Изучи требования и начни подготовку к языковым тестам', icon: '📋' },
  { month: '3-4 месяца', task: 'Пройди онлайн-курсы по своей специальности', icon: '📚' },
  { month: '5-6 месяца', task: 'Сдай языковые тесты (IELTS/TOEFL/ОРТ)', icon: '✍️' },
  { month: '7-8 месяца', task: 'Напиши мотивационное письмо и собери документы', icon: '📝' },
  { month: '9-10 месяца', task: 'Подай заявку и жди решения', icon: '📨' },
  { month: '11-12 месяца', task: 'Оформи визу и готовься к переезду', icon: '✈️' },
];

export default function UniversityDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [uni, setUni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
    fetchUniversity();
  }, [name]);

  const fetchUniversity = async () => {
    try {
      const res = await axios.get(`${API_URL}/recommendations/requirements/${name}`);
      setUni(res.data);
    } catch {
      navigate('/recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="ud-loading">
      <div className="ud-spinner"></div>
    </div>
  );

  if (!uni) return null;

  const tests = TESTS[uni.country] || ['Уточняй на официальном сайте'];
  const resources = uni.specialties
    .flatMap(s => RESOURCES[s] || [])
    .filter((r, i, arr) => arr.findIndex(x => x.url === r.url) === i)
    .slice(0, 6);

  return (
    <div className="ud-container">
      <div className="ud-header">
        <button className="ud-back" onClick={() => navigate('/recommendations')}>← Назад</button>
        <div className="ud-logo">
          <span>Aivora</span><span className="dot">.</span>
        </div>
      </div>

      <div className="ud-hero">
        <div className="ud-hero-content">
          <h1>{uni.university}</h1>
          <p className="ud-location">📍 {uni.city}, {uni.country}</p>
          <div className="ud-tags">
            {uni.specialties.map((s, i) => <span key={i} className="ud-tag">{s}</span>)}
          </div>
          <div className="ud-actions">
            <a href={uni.website} target="_blank" rel="noreferrer" className="ud-btn-primary">
              Официальный сайт →
            </a>
            <button className="ud-btn-secondary" onClick={() => navigate('/chat')}>
              💬 Спросить AI
            </button>
          </div>
        </div>
        <div className="ud-score-big">{uni.minScore}+</div>
      </div>

      <div className="ud-tabs">
        {['overview', 'prepare', 'resources'].map(tab => (
          <button
            key={tab}
            className={`ud-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' ? '📋 Обзор' : tab === 'prepare' ? '🗓️ Подготовка' : '📚 Ресурсы'}
          </button>
        ))}
      </div>

      <div className="ud-content">

        {activeTab === 'overview' && (
          <div className="ud-section">
            <div className="ud-cards-grid">
              <div className="ud-card">
                <h3>📝 Требования к поступлению</h3>
                <p>{uni.admissionInfo}</p>
              </div>
              <div className="ud-card">
                <h3>🧪 Необходимые тесты</h3>
                <ul>
                  {tests.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              <div className="ud-card">
                <h3>🎓 Специальности</h3>
                <div className="ud-specialty-list">
                  {uni.specialties.map((s, i) => <span key={i} className="ud-tag">{s}</span>)}
                </div>
              </div>
              <div className="ud-card">
                <h3>⭐ Минимальный балл</h3>
                <div className="ud-score-display">{uni.minScore} / 100</div>
                <p>Конкурентоспособный уровень для поступления</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prepare' && (
          <div className="ud-section">
            <h2>🗓️ Дорожная карта подготовки</h2>
            <p className="ud-section-sub">Следуй этому плану чтобы успешно поступить за 12 месяцев</p>
            <div className="ud-timeline">
              {TIMELINE.map((step, i) => (
                <div key={i} className="ud-timeline-item">
                  <div className="ud-timeline-icon">{step.icon}</div>
                  <div className="ud-timeline-body">
                    <span className="ud-timeline-month">{step.month}</span>
                    <p>{step.task}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="ud-cta">
              <h3>Нужна персональная помощь?</h3>
              <p>Наш AI советник составит индивидуальный план подготовки именно для тебя</p>
              <button className="ud-btn-primary" onClick={() => navigate('/chat')}>
                💬 Начать подготовку с AI
              </button>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="ud-section">
            <h2>📚 Учебные ресурсы</h2>
            <p className="ud-section-sub">Подобраны специально для специальностей {uni.university}</p>
            <div className="ud-resources-grid">
              {resources.length > 0 ? resources.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noreferrer" className="ud-resource-card">
                  <div className="ud-resource-icon">{r.icon}</div>
                  <div className="ud-resource-body">
                    <span className="ud-resource-type">{r.type}</span>
                    <p>{r.title}</p>
                  </div>
                  <span className="ud-resource-arrow">→</span>
                </a>
              )) : (
                <p className="ud-no-resources">Ресурсы скоро появятся</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}