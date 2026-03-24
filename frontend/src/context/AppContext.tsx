import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Profession } from '../data/mockData';

export type ViewState = 'onboarding' | 'chat' | 'results' | 'detail';

interface UserProfile {
  grade?: string;
  region?: string;
  goal?: string;
  gpa?: string;
  ielts?: string;
  extracurriculars?: string[];
  profession?: string;
  strengths: string[];
}

interface AppContextType {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  selectedProfession: Profession | null;
  setSelectedProfession: (prof: Profession | null) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewState>('onboarding');
  const [userProfile, setUserProfile] = useState<UserProfile>({ strengths: [] });
  const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null);

  const resetApp = () => {
    setCurrentView('onboarding');
    setUserProfile({ strengths: [] });
    setSelectedProfession(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        userProfile,
        setUserProfile,
        selectedProfession,
        setSelectedProfession,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
