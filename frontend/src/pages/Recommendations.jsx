import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Recommendations.css';

const API_URL = 'https://aivora-backend-l8mv.onrender.com';

export default function Recommendations() {
  const [universities, setUniversities] = useState([]);
  const [interests, setInterests] = useState('');
  const [country, setCountry] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
    fetchCountries();
    fetchAll();
  }, [navigate]);

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${API_URL}/recommendations/countries`);
      setCountries(res.data);
    } catch {}
  };

  const fetchAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/recommendations`);
      setUniversities(res.data);
    } catch {}
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.post(`${API_URL}/recommendations`,
        { interests, country, specialty },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUniversities(res.data);
    } catch {
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInterests('');
    setCountry('');
    setSpecialty('');
    setSearched(false);
    fetchAll();
  };

  const specialties = ['Computer Science', 'Business', 'Medicine', 'Engineering', 'Law', 'Economics', 'AI', 'Data Science'];

  return (
    <div className="rec-container">
      <div className="rec-header">
        <button className="back-btn" onClick={() => navigate('/chat')}>← Назад</button>
        <div className="rec-logo">
          <span className="logo-text">Aivora</span><span className="logo-dot">.</span>
        </div>
      </div>

      <div className="rec-content">
        <h1>🎓 Подбор университетов</h1>
        <p className="rec-subtitle">Найди идеальный университет по своим интересам</p>

        <div className="filters">
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Интересы: программирование, медицина..."
            className="filter-input"
          />
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="filter-select">
            <option value="">🌍 Все страны</option>
            {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
          <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="filter-select">
            <option value="">📚 Все специальности</option>
            {specialties.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
          <div className="filter-buttons">
            <button onClick={handleSearch} disabled={loading} className="btn-search">
              {loading ? '...' : 'Найти'}
            </button>
            <button onClick={handleReset} className="btn-reset">Сбросить</button>
          </div>
        </div>

        {searched && !loading && universities.length === 0 && (
          <div className="no-results">Ничего не найдено. Попробуй другие фильтры.</div>
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
              <button 
                className="ud-detail-btn" 
                onClick={() => navigate(`/university/${encodeURIComponent(uni.name)}`)}
              >
                📋 Подробнее и план подготовки
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}