import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowRight, BookOpen, MapPin, Target, Award, Star } from 'lucide-react';

const EXTRA_OPTIONS = [
  'Волонтерство', 'Олимпиады', 'Спорт', 'Школьное самоуправление', 'Научные проекты', 'Нет'
];

const Onboarding: React.FC = () => {
  const { setCurrentView, setUserProfile } = useAppContext();
  const [step, setStep] = useState(1);
  const [grade, setGrade] = useState('');
  const [region, setRegion] = useState('');
  
  const [gpa, setGpa] = useState('');
  const [ielts, setIelts] = useState('');
  
  const [extracurriculars, setExtracurriculars] = useState<string[]>([]);
  const [profession, setProfession] = useState('');

  const handleExtraToggle = (item: string) => {
    if (item === 'Нет') {
      setExtracurriculars(['Нет']);
      return;
    }
    
    setExtracurriculars(prev => {
      const filtered = prev.filter(x => x !== 'Нет');
      if (filtered.includes(item)) return filtered.filter(x => x !== item);
      return [...filtered, item];
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setUserProfile((prev) => ({ 
        ...prev, 
        grade, 
        region, 
        gpa, 
        ielts, 
        extracurriculars, 
        profession 
      }));
      
      // Dynamic routing: skip chat if they picked a profession
      if (profession === 'undecided') {
        setCurrentView('chat');
      } else {
        // Here we should fetch data from backend right away, but to keep the app flow linear for MVP
        // we can navigate to results and let Dashboard run the fetch or mock wait.
        setCurrentView('results');
      }
    }
  };

  const isValidStep = () => {
    if (step === 1) return grade && region;
    if (step === 2) return gpa && ielts;
    if (step === 3) return extracurriculars.length > 0;
    if (step === 4) return profession;
    return true;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div className="glass" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Добро пожаловать в Aivora</h2>
          <p style={{ color: 'var(--text-muted)' }}>Твой персональный AI-навигатор в мир профессий и грантов.</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          {/* Progress Bar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                style={{
                  height: '4px',
                  flex: 1,
                  borderRadius: '2px',
                  backgroundColor: s <= step ? 'var(--primary)' : 'var(--border-dark)',
                  transition: 'background-color var(--transition-smooth)'
                }}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <BookOpen size={20} color="var(--primary)" /> В каком ты классе/курсе?
                </label>
                <select className="select" value={grade} onChange={(e) => setGrade(e.target.value)}>
                  <option value="">Выберите...</option>
                  <option value="9 класс">9 класс</option>
                  <option value="10 класс">10 класс</option>
                  <option value="11 класс">11 класс</option>
                  <option value="Студент колледжа/ВУЗа">Студент колледжа/ВУЗа</option>
                  <option value="Выпускник">Выпускник</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <MapPin size={20} color="var(--primary)" /> Твой регион:
                </label>
                <select className="select" value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="">Выберите регион...</option>
                  <option value="Бишкек">Бишкек</option>
                  <option value="Ош">Ош</option>
                  <option value="Чуйская">Чуйская область</option>
                  <option value="Иссык-Кульская">Иссык-Кульская область</option>
                  <option value="Нарынская">Нарынская область</option>
                  <option value="Таласская">Таласская область</option>
                  <option value="Баткенская">Баткенская область</option>
                  <option value="Джалал-Абадская">Джалал-Абадская область</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <Award size={20} color="var(--primary)" /> Средний балл (GPA / Аттестат):
                </label>
                <select className="select" value={gpa} onChange={(e) => setGpa(e.target.value)}>
                  <option value="">Выберите...</option>
                  <option value="Отличник (4.5 - 5.0)">Отличник (4.5 - 5.0)</option>
                  <option value="Хорошист (3.5 - 4.4)">Хорошист (3.5 - 4.4)</option>
                  <option value="Средний (2.5 - 3.4)">Средний (2.5 - 3.4)</option>
                </select>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Это нужно для подбора грантов</p>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <Star size={20} color="var(--primary)" /> Балл IELTS (если есть):
                </label>
                <select className="select" value={ielts} onChange={(e) => setIelts(e.target.value)}>
                  <option value="">Выберите...</option>
                  <option value="Нет IELTS">Нет IELTS</option>
                  <option value="4.0 - 5.0">4.0 - 5.0</option>
                  <option value="5.5 - 6.0">5.5 - 6.0</option>
                  <option value="6.5 - 7.0">6.5 - 7.0</option>
                  <option value="7.5+">7.5+</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <Target size={20} color="var(--primary)" /> Внеклассная активность:
              </label>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Выбери всё, в чем ты участвуешь (важно для получения стипендий)</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {EXTRA_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleExtraToggle(opt)}
                    className="btn"
                    style={{
                      background: extracurriculars.includes(opt) ? 'var(--primary)' : 'transparent',
                      color: extracurriculars.includes(opt) ? 'white' : 'var(--text-main)',
                      border: `1px solid ${extracurriculars.includes(opt) ? 'var(--primary)' : 'var(--border-dark)'}`,
                      padding: '0.5rem 1rem',
                      fontSize: '0.9rem',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <Target size={20} color="var(--primary)" /> Твое направление:
              </label>
              <select className="select" value={profession} onChange={(e) => setProfession(e.target.value)}>
                <option value="">Выбери свою цель...</option>
                <option value="undecided">🤔 ПОМОГИ ВЫБРАТЬ ПРОФЕССИЮ (Пройти тест)</option>
                <optgroup label="IT и Данные">
                  <option value="Frontend-разработчик">Frontend-разработчик</option>
                  <option value="Data-аналитик">Data-аналитик</option>
                </optgroup>
                <optgroup label="Творчество и Управление">
                  <option value="SMM-специалист">SMM-специалист</option>
                  <option value="UI/UX Дизайнер">UI/UX Дизайнер</option>
                  <option value="Менеджер проектов (Project Manager)">Менеджер проектов (Project Manager)</option>
                </optgroup>
                <optgroup label="Другие сферы">
                  <option value="Финансовый консультант">Финансовый консультант</option>
                  <option value="Врач-телемедицины">Врач</option>
                </optgroup>
              </select>
            </div>
          )}
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          onClick={handleNext}
          disabled={!isValidStep()}
        >
          {step === 4 ? (profession === 'undecided' ? 'Начать диагностику' : 'Показать результаты') : 'Далее'} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
