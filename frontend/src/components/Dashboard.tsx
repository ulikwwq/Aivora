import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Award, Briefcase, ChevronLeft, GraduationCap, MapPin, Sparkles, AlertCircle, CheckCircle2, Loader2, Filter } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { userProfile, currentView, setCurrentView, selectedProfession, setSelectedProfession, resetApp } = useAppContext();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [filterGrantsOnly, setFilterGrantsOnly] = useState(false);

  useEffect(() => {
    // If we land here, fetch personalized backend plan
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userProfile })
        });
        
        if (res.ok) {
          const json = await res.json();
          setData(json);
          // If the user already selected a profession directly in onboarding, auto-select it here
          if (userProfile.profession && userProfile.profession !== 'undecided' && json.recommendedProfessions.length > 0) {
            setSelectedProfession(json.recommendedProfessions[0]);
            setCurrentView('detail'); // auto-expand to detailed view
          }
        }
      } catch (err) {
        console.error('API Error', err);
      }
      setLoading(false);
    };

    if (currentView === 'results' || currentView === 'detail') {
      fetchPlan();
    }
  }, [currentView, userProfile]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
        <Loader2 size={48} color="var(--primary)" className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />
        <h3 style={{ color: 'var(--text-main)' }}>Анализируем ваши данные...</h3>
        <p style={{ color: 'var(--text-muted)' }}>Подбираем гранты, программы и оцениваем стипендии</p>
      </div>
    );
  }

  if (!data) return <div>Ошибка загрузки</div>;

  const topProfessions = data.recommendedProfessions;
  const recommendedUnis = filterGrantsOnly 
    ? data.recommendedUniversities.filter((u: any) => u.eligibleForGrant)
    : data.recommendedUniversities;

  // Single Detail View Mode
  if (currentView === 'detail' && selectedProfession) {
    return (
      <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
        {/* If the user only has 1 recommended profession (meaning they chose it directly), replace "Назад к результатам" with reset */}
        {topProfessions.length > 1 ? (
          <button 
            className="btn btn-outline glass-hover" 
            style={{ marginBottom: '1.5rem', background: 'var(--surface-color)' }}
            onClick={() => {
              setCurrentView('results');
              setSelectedProfession(null);
            }}
          >
            <ChevronLeft size={20} /> Назад к выбору
          </button>
        ) : (
          <button 
            className="btn btn-outline glass-hover" 
            style={{ marginBottom: '1.5rem', background: 'var(--surface-color)' }}
            onClick={resetApp}
          >
            <ChevronLeft size={20} /> Изменить данные
          </button>
        )}

        <div className="glass" style={{ padding: '2.5rem', marginBottom: '2.5rem', border: '1px solid var(--primary-glow)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Ваша Траектория: {selectedProfession.category}
              </span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)', lineHeight: 1.1 }}>{selectedProfession.title}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>{selectedProfession.description}</p>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Award size={22} color="var(--primary)" /> Необходимые навыки для освоения
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {selectedProfession.skills.map((skill: string, idx: number) => (
                <span key={idx} style={{ padding: '0.5rem 1.25rem', background: 'var(--surface-alt)', border: '1px solid var(--border-dark)', color: 'var(--text-main)', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: 500 }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Action Plan */}
          <div className="glass glass-hover" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <TargetIcon color="var(--primary)" size={26} /> План старта на месяц
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {[1, 2, 3, 4].map(week => (
                <div key={week} style={{ display: 'flex', gap: '1.25rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', background: 'var(--primary)', boxShadow: 'var(--shadow-hover)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 }}>
                    {week}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '1.1rem' }}>Неделя {week}</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                      {selectedProfession.plan[`week${week}` as keyof typeof selectedProfession.plan]} // 
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Universities & Grant Filtering */}
          <div className="glass glass-hover" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                <GraduationCap color="var(--primary)" size={26} /> Университеты
              </h3>
              <button 
                onClick={() => setFilterGrantsOnly(!filterGrantsOnly)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.8rem', borderRadius: '1rem', border: '1px solid var(--primary)',
                  background: filterGrantsOnly ? 'var(--primary)' : 'transparent',
                  color: filterGrantsOnly ? 'white' : 'var(--primary)',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <Filter size={14} /> Только Гранты
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {recommendedUnis.length > 0 ? recommendedUnis.map((uni: any) => (
                <div key={uni.id} style={{ padding: '1.25rem', border: '1px solid var(--border-dark)', borderRadius: '1.25rem', background: 'var(--surface-color)', position: 'relative', overflow: 'hidden' }}>
                  {uni.eligibleForGrant && (
                    <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--secondary)', color: 'white', padding: '0.2rem 0.6rem', borderBottomLeftRadius: '0.8rem', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Грант Доступен
                    </div>
                  )}
                  <h4 style={{ margin: 0, marginBottom: '0.5rem', paddingRight: '120px', fontSize: '1.1rem' }}>
                    {uni.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                    <MapPin size={14} /> {uni.location}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', marginBottom: '1rem' }}>{uni.description}</p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {uni.tags.map((tag: string, i: number) => (
                      <span key={i} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'var(--bg-color)', border: '1px solid var(--border-dark)', borderRadius: '1rem', color: 'var(--text-main)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {!uni.eligibleForGrant && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#ef4444' }}>
                      <AlertCircle size={16} /> GPA или IELTS ниже требуемого для гранта в этом ВУЗе.
                    </div>
                  )}
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Нет университетов, подходящих под критерии "Грант". Попробуйте сдать IELTS или отключить фильтр.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Multi-profession selection mode (if undecided previously)
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Твой персональный маршрут</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Анализ завершен. Вот что ИИ подобрал специально для тебя.</p>
      </div>

      <div className="glass glass-hover" style={{ padding: '2.5rem', marginBottom: '3.5rem', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid var(--primary-glow)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', color: 'var(--text-main)' }}>
          <Sparkles size={26} color="var(--primary)" /> Твои сильные стороны
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.25rem' }}>
          {data.strengths.map((strength: string, idx: number) => (
            <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s`, padding: '0.85rem 1.75rem', background: 'var(--surface-color)', border: '1px solid var(--border-light)', borderRadius: '2rem', boxShadow: 'var(--shadow-soft)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--primary)' }}>
              {strength}
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
        <Briefcase size={28} color="var(--primary)" /> Топ направлений для тебя
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {topProfessions.map((prof: any, idx: number) => (
          <div 
            key={prof.id} 
            className="glass glass-hover animate-fade-in" 
            style={{ 
              padding: '2rem', 
              animationDelay: `${idx * 0.1}s`,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => {
              setSelectedProfession(prof);
              setCurrentView('detail');
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', padding: '0.35rem 1rem', borderBottomLeftRadius: '1.25rem', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: 'var(--shadow-soft)' }}>
              {prof.matchScore}% Match
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{prof.category}</span>
            <h4 style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>{prof.title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {prof.description}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {prof.skills.slice(0, 2).map((skill: string, i: number) => (
                <span key={i} style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', background: 'var(--surface-alt)', border: '1px solid var(--border-dark)', borderRadius: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>
                  {skill}
                </span>
              ))}
              {prof.skills.length > 2 && (
                <span style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', background: 'transparent', color: 'var(--text-muted)' }}>
                  +{prof.skills.length - 2}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '5rem', textAlign: 'center' }}>
        <button className="btn btn-primary" onClick={resetApp}>
          Пройти диагностику заново
        </button>
      </div>
    </div>
  );
};

const TargetIcon = ({ color, size }: { color?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

export default Dashboard;
