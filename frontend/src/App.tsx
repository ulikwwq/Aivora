import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Onboarding from './components/Onboarding.tsx';
import DiagnosticChat from './components/DiagnosticChat.tsx';
import Dashboard from './components/Dashboard.tsx';

const AppContent: React.FC = () => {
  const { currentView } = useAppContext();

  return (
    <>
      <div className="app-bg-gradient"></div>
      <div className="container" style={{ padding: '2rem 1rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <div className="glass" style={{ padding: '0.75rem 2rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '2rem', height: '2rem', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>A</div>
            <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, color: 'var(--primary)' }}>Aivora</h1>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {currentView === 'onboarding' && <Onboarding />}
          {currentView === 'chat' && <DiagnosticChat />}
          {(currentView === 'results' || currentView === 'detail') && <Dashboard />}
        </main>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
