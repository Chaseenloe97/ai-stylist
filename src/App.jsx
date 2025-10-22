import { useState, useEffect } from 'react';
import Home from './components/Home';
import Chat from './components/Chat';
import Profile from './components/Profile';
import Explore from './components/Explore';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [styleProfile, setStyleProfile] = useState(null);

  useEffect(() => {
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
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      id: 'chat',
      label: 'Vic',
      icon: (
        <div className="w-7 h-7 bg-ink-900 flex items-center justify-center">
          <span className="text-xs text-gold-400 font-serif italic">V</span>
        </div>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
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
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-ink-900 flex items-center justify-center">
                <span className="text-xl text-gold-400 font-serif italic">V</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-ink-900">Vic</h1>
                <p className="text-xs text-ink-600 font-light -mt-1">Style Curator</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 transition-all duration-300 relative ${
                    currentTab === tab.id
                      ? 'text-ink-900 bg-cream-100'
                      : 'text-ink-900/50 hover:text-ink-900/80 hover:bg-cream-50'
                  }`}
                >
                  <div className={`transition-all duration-300 ${
                    currentTab === tab.id ? 'scale-110' : 'scale-100'
                  }`}>
                    {tab.icon}
                  </div>
                  <span className="text-sm font-medium tracking-wide hidden md:inline">
                    {tab.label}
                  </span>
                  {currentTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-400"></div>
                  )}
                </button>
              ))}
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
          <Explore styleProfile={styleProfile} />
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
