import { useState } from 'react';
import { getApiKey, saveApiKey, clearApiKey } from '../services/openai';

export default function Settings({ onClose }) {
  const [apiKey, setApiKey] = useState(getApiKey() || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to remove your API key? This will disable real AI features.')) {
      clearApiKey();
      setApiKey('');
      setSaved(false);
    }
  };

  const maskApiKey = (key) => {
    if (!key || key.length < 8) return key;
    return key.substring(0, 7) + '•'.repeat(Math.min(key.length - 7, 40));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-6">
      <div className="card-luxury max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Settings</h2>
            <p className="text-sm text-ink-600 font-light">Configure your AI Stylist experience</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-cream-100 transition-colors"
            >
              <svg className="w-6 h-6 text-ink-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-cream-200 to-transparent mb-8"></div>

        {/* OpenAI API Key Section */}
        <div className="mb-8">
          <div className="flex items-start space-x-3 mb-4">
            <svg className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <div>
              <h3 className="font-serif text-xl font-bold mb-1">OpenAI API Key</h3>
              <p className="text-sm text-ink-600 font-light leading-relaxed">
                Enable real AI-powered style analysis with GPT-4 Vision. Your API key is stored locally and never sent to our servers.
              </p>
            </div>
          </div>

          <div className="bg-cream-50 border border-cream-200 p-6 mb-4">
            <label className="block mb-3">
              <span className="text-sm font-medium text-ink-900 mb-2 block">API Key</span>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="input-luxury pr-24 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-600 hover:text-ink-900 font-medium"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="btn-gold rounded-none px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saved ? 'Saved!' : 'Save API Key'}
              </button>
              {getApiKey() && (
                <button
                  onClick={handleClear}
                  className="btn-outline rounded-none px-6 py-2 text-sm"
                >
                  Clear
                </button>
              )}
            </div>

            {saved && (
              <p className="text-xs text-green-600 mt-3 font-medium">
                ✓ API key saved successfully. You can now enable real AI in the toggle switches.
              </p>
            )}
          </div>

          {/* How to get API key */}
          <div className="bg-blue-50 border border-blue-200 p-4 text-sm">
            <h4 className="font-medium text-ink-900 mb-2">How to get an OpenAI API key:</h4>
            <ol className="space-y-2 text-ink-700 font-light">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-medium">1.</span>
                <span>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">platform.openai.com/api-keys</a></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-medium">2.</span>
                <span>Sign in or create an OpenAI account</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-medium">3.</span>
                <span>Click "Create new secret key"</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2 font-medium">4.</span>
                <span>Copy the key and paste it above</span>
              </li>
            </ol>
            <p className="mt-3 text-xs text-ink-600">
              <strong>Note:</strong> API usage is billed by OpenAI. GPT-4 Vision typically costs ~$0.01-0.03 per image analysis.
            </p>
          </div>
        </div>

        {/* Privacy Section */}
        <div>
          <div className="flex items-start space-x-3 mb-4">
            <svg className="w-6 h-6 text-gold-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h3 className="font-serif text-xl font-bold mb-1">Privacy & Data</h3>
              <p className="text-sm text-ink-600 font-light leading-relaxed">
                Your data is processed with the highest privacy standards:
              </p>
            </div>
          </div>

          <div className="bg-cream-50 border border-cream-200 p-6">
            <ul className="space-y-3 text-sm text-ink-700">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-light">All photos and style profiles are stored locally in your browser</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-light">Your API key is stored only on your device (localStorage)</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-light">When using real AI, images are sent directly to OpenAI's API (end-to-end encrypted)</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-light">We never see, store, or have access to your photos or API key</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-light">Clear your browser data to completely remove all traces</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <div className="mt-8 pt-6 border-t border-cream-200">
            <button
              onClick={onClose}
              className="btn-outline rounded-none w-full"
            >
              Close Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
