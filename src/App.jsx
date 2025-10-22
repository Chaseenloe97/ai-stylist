import { useState, useEffect } from 'react';
import GetStarted from './components/GetStarted';
import Home from './components/Home';
import Chat from './components/Chat';
import Profile from './components/Profile';
import PersonalizedExplore from './components/PersonalizedExplore';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [styleProfile, setStyleProfile] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const savedUser = localStorage.getItem('vicUser');
    if (savedUser) {
      setHasCompletedOnboarding(true);
    }

    // Load style profile if it exists
    const saved = localStorage.getItem('styleProfile');
    if (saved) {
      try {
        setStyleProfile(JSON.parse(saved));
        setCurrentTab('chat');
      } catch (e) {
        console.error('Failed to load style profile:', e);
      }
    }
  }, []);

  const handleOnboardingComplete = (userData) => {
    console.log('User signed up:', userData);
    setHasCompletedOnboarding(true);
  };

  // Show Get Started page if user hasn't completed onboarding
  if (!hasCompletedOnboarding) {
    return <GetStarted onComplete={handleOnboardingComplete} />;
  }

  const handleStyleLearned = (profile) => {
    setStyleProfile(profile);
    localStorage.setItem('styleProfile', JSON.stringify(profile));
    setCurrentTab('chat');
  };

  const handleRefresh = () => {
    setCurrentTab('home');
  };

  const tabs = [
    {
      id: 'home',
      label: 'Discover',
      color: 'rose',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'explore',
      label: 'Explore',
      color: 'amber',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      id: 'chat',
      label: 'Vic',
      color: 'gold',
      icon: (
        <div className="w-7 h-7 bg-gradient-to-br from-ink-900 to-ink-700 flex items-center justify-center shadow-sm">
          <span className="text-xs text-gold-400 font-serif italic">V</span>
        </div>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      color: 'slate',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Top Navigation Banner */}
      <nav className="sticky top-0 z-50 bg-white border-b border-cream-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 md:px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-ink-900 flex items-center justify-center">
                <span className="text-lg md:text-xl text-gold-400 font-serif italic">V</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif font-bold text-base md:text-lg text-ink-900">Vic</h1>
                <p className="text-xs text-ink-600 font-light -mt-1">Style Curator</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1">
              {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                const colorClasses = {
                  rose: {
                    active: 'bg-gradient-to-br from-rose-50 to-pink-50 text-rose-700 border-rose-200',
                    hover: 'hover:bg-rose-50/50',
                    accent: 'bg-gradient-to-r from-rose-400 to-pink-500'
                  },
                  amber: {
                    active: 'bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 border-amber-200',
                    hover: 'hover:bg-amber-50/50',
                    accent: 'bg-gradient-to-r from-amber-400 to-orange-500'
                  },
                  gold: {
                    active: 'bg-gradient-to-br from-gold-50 to-yellow-50 text-gold-700 border-gold-200',
                    hover: 'hover:bg-gold-50/50',
                    accent: 'bg-gradient-to-r from-gold-400 to-yellow-500'
                  },
                  slate: {
                    active: 'bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700 border-slate-200',
                    hover: 'hover:bg-slate-50/50',
                    accent: 'bg-gradient-to-r from-slate-400 to-gray-500'
                  }
                };

                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`group flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-lg transition-all duration-300 relative border ${
                      isActive
                        ? `${colorClasses[tab.color].active} shadow-sm`
                        : `text-ink-900/50 border-transparent ${colorClasses[tab.color].hover}`
                    }`}
                  >
                    <div className={`transition-all duration-300 ${
                      isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'
                    }`}>
                      {tab.icon}
                    </div>
                    <span className={`text-xs md:text-sm font-medium tracking-wide hidden sm:inline transition-all duration-300 ${
                      isActive ? 'font-semibold' : 'group-hover:text-ink-900/70'
                    }`}>
                      {tab.label}
                    </span>
                    {isActive && (
                      <div className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full ${colorClasses[tab.color].accent} shadow-sm`}></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div>
        {currentTab === 'home' && (
          <Home onStyleLearned={handleStyleLearned} />
        )}
        {currentTab === 'explore' && (
          <PersonalizedExplore />
        )}
        {currentTab === 'chat' && (
          <Chat styleProfile={styleProfile} />
        )}
        {currentTab === 'profile' && (
          <Profile styleProfile={styleProfile} onRefresh={handleRefresh} />
        )}
      </div>
    </div>
  );
}

export default App;
