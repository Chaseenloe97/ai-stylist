import { useState } from 'react';
import { trackSignup } from '../services/analytics';

export default function GetStarted({ onComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagram: '',
    interests: []
  });
  const [currentStep, setCurrentStep] = useState(1);

  const styleInterests = [
    { id: 'minimalist', label: 'Minimalist', icon: '◼' },
    { id: 'streetwear', label: 'Streetwear', icon: '▲' },
    { id: 'professional', label: 'Professional', icon: '◇' },
    { id: 'bohemian', label: 'Bohemian', icon: '✿' },
    { id: 'modern', label: 'Modern', icon: '◆' },
    { id: 'vintage', label: 'Vintage', icon: '◉' }
  ];

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      ...formData,
      signupDate: new Date().toISOString()
    };

    // Save user data to localStorage
    localStorage.setItem('vicUser', JSON.stringify(userData));

    // Track signup in Google Sheets (async, don't wait for it)
    trackSignup(userData).catch(err => {
      console.error('Analytics tracking failed:', err);
      // Don't block user flow if tracking fails
    });

    // Complete onboarding
    onComplete(formData);
  };

  const canProceed = () => {
    if (currentStep === 1) return formData.name.trim().length > 0;
    if (currentStep === 2) return formData.email.trim().length > 0 && formData.email.includes('@');
    if (currentStep === 3) return true; // Instagram is optional, always can proceed
    if (currentStep === 4) return formData.interests.length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 flex items-center justify-center px-3 md:px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-ink-900 flex items-center justify-center">
            <span className="text-3xl md:text-4xl text-gold-400 font-serif italic">V</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 md:mb-4 tracking-tight text-ink-900">
            Welcome to Vic
          </h1>
          <p className="text-sm md:text-lg text-ink-700 font-light">
            Your Personal AI Style Curator
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8 md:mb-12">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-serif transition-all duration-300 ${
                  currentStep >= step
                    ? 'bg-ink-900 text-gold-400'
                    : 'bg-cream-200 text-ink-900/40'
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`w-8 md:w-12 h-0.5 mx-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-ink-900' : 'bg-cream-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="card-luxury p-6 md:p-10 animate-slide-up">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Name */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2 text-ink-900">
                  What's your name?
                </h2>
                <p className="text-sm md:text-base text-ink-600 mb-6 md:mb-8 font-light">
                  Let's start by getting to know you
                </p>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="input-luxury text-lg md:text-xl mb-6 md:mb-8"
                  autoFocus
                />

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceed()}
                  className="btn-gold w-full rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Email */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2 text-ink-900">
                  Nice to meet you, {formData.name}
                </h2>
                <p className="text-sm md:text-base text-ink-600 mb-6 md:mb-8 font-light">
                  What's your email address?
                </p>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                  className="input-luxury text-lg md:text-xl mb-6 md:mb-8"
                  autoFocus
                />

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="btn-secondary flex-1 rounded-none"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={!canProceed()}
                    className="btn-gold flex-1 rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Instagram Handle */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2 text-ink-900">
                  Instagram handle (optional)
                </h2>
                <p className="text-sm md:text-base text-ink-600 mb-6 md:mb-8 font-light">
                  Don't have Instagram? No problem, leave it blank
                </p>

                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                  placeholder="@yourusername"
                  className="input-luxury text-lg md:text-xl mb-6 md:mb-8"
                  autoFocus
                />

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="btn-secondary flex-1 rounded-none"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="btn-gold flex-1 rounded-none"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Style Interests */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2 text-ink-900">
                  What styles interest you?
                </h2>
                <p className="text-sm md:text-base text-ink-600 mb-6 md:mb-8 font-light">
                  Select all that apply (we'll refine this later)
                </p>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                  {styleInterests.map((interest) => (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-4 md:p-6 border-2 transition-all duration-300 text-left ${
                        formData.interests.includes(interest.id)
                          ? 'border-gold-400 bg-cream-50'
                          : 'border-cream-200 hover:border-ink-900/30'
                      }`}
                    >
                      <div className="text-2xl md:text-3xl mb-2">{interest.icon}</div>
                      <div className="font-serif text-base md:text-lg font-bold text-ink-900">
                        {interest.label}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="btn-secondary flex-1 rounded-none"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!canProceed()}
                    className="btn-gold flex-1 rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs md:text-sm text-ink-500 mt-6 md:mt-8 font-light">
          By continuing, you agree to Vic's terms of service and privacy policy
        </p>
      </div>
    </div>
  );
}
