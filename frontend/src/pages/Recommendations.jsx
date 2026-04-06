import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Recommendations.css';

const API_URL = 'https://aivora-backend-l8mv.onrender.com';

export default function Recommendations() {
  const [universities, setUniversities] = useState([]);
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  const handleSearch = async () => {
    if (!interests.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.post(`${API_URL}/recommendations`,
        { interests },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUniversities(res.data);
    } catch {
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rec-container">
      <div className="rec-header">
        <button className="back-btn" onClick={() => navigate('/chat')}>← Назад</button>
        <div className="rec-logo">
          <span className="logo-text">Aivora</span><span className="logo-dot">.</span>
        </div>
      </div>

      <div className="rec-content">
        <h1>Подбор университетов</h1>
        <p className="rec-subtitle">Введи свои интересы и мы подберём лучшие университеты</p>

        <div className="search-box">
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Например: программирование, бизнес, медицина..."
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? '...' : 'Найти'}
          </button>
        </div>

        {searched && !loading && universities.length === 0 && (
          <div className="no-results">Ничего не найдено. Попробуй другие интересы.</div>
        )}

        <div className="uni-grid">
          {universities.map((uni, i) => (
            <div key={i} className="uni-card">
              <div className="uni-header">
                <div>
                  <h3>{uni.name}</h3>
                  <span className="uni-location">📍 {uni.city}, {uni.country}</span>
                </div>
                <div className="uni-score">{uni.minScore}+</div>
              </div>
              <p className="uni-desc">{uni.description}</p>
              <div className="uni-specialties">
                {uni.specialties.map((s, j) => (
                  <span key={j} className="tag">{s}</span>
                ))}
              </div>
              <div className="uni-admission">
                <strong>Поступление:</strong> {uni.admissionInfo}
              </div>
              <a href={uni.website} target="_blank" rel="noreferrer" className="uni-link">
                Официальный сайт →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}