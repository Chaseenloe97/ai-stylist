import { useState } from 'react';
import Settings from './Settings';

export default function Profile({ styleProfile, onRefresh }) {
  const [showInsights, setShowInsights] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!styleProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center px-3 md:px-6">
        <div className="max-w-xl text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8 bg-cream-100 border-2 border-cream-200 flex items-center justify-center">
            <svg className="h-10 w-10 md:h-12 md:w-12 text-ink-900/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <h2 className="text-2xl md:text-3xl font-serif font-bold text-ink-900 mb-3 md:mb-4">
            Your Profile Awaits
          </h2>
          <p className="text-sm md:text-base text-ink-600 mb-6 md:mb-8 leading-relaxed font-light">
            Begin your style journey by allowing Vic to analyze your aesthetic preferences.
          </p>

          <button
            onClick={onRefresh}
            className="btn-gold rounded-none"
          >
            Begin Analysis
          </button>
        </div>
      </div>
    );
  }

  const { summary, topStyles, topTags } = styleProfile;

  const styleInsights = {
    minimalist: {
      icon: '◼',
      description: 'Your minimalist sensibility speaks to intentionality and restraint. Every piece serves a purpose.',
      tips: [
        'Invest in architectural pieces with exceptional tailoring',
        'Build a neutral color foundation, then add subtle accents',
        'Quality fabrication matters more than quantity',
      ]
    },
    modern: {
      icon: '◆',
      description: 'Contemporary design principles guide your choices. You appreciate innovation balanced with wearability.',
      tips: [
        'Explore emerging designers pushing boundaries',
        'Mix textures and unexpected proportions',
        'Stay aware of cultural shifts in fashion',
      ]
    },
    streetwear: {
      icon: '▲',
      description: 'Urban influences and cultural awareness define your aesthetic. You understand fashion as expression.',
      tips: [
        'Layer pieces to create visual interest and dimension',
        'Mix high and low — vintage with contemporary',
        'Comfort and style should coexist seamlessly',
      ]
    },
    professional: {
      icon: '◇',
      description: 'Polished sophistication with attention to detail. You understand the power of impeccable presentation.',
      tips: [
        'Tailoring is non-negotiable — find an excellent tailor',
        'Build a versatile foundation in timeless cuts',
        'Subtle details elevate: horn buttons, silk linings',
      ]
    },
    bohemian: {
      icon: '✿',
      description: 'Free-spirited eclecticism with an appreciation for craftsmanship and natural materials.',
      tips: [
        'Seek artisanal pieces with provenance and story',
        'Layer textures: linen, silk, woven materials',
        'Vintage markets hold treasures for your aesthetic',
      ]
    },
  };

  const primaryStyle = topStyles?.[0] || 'modern';
  const insight = styleInsights[primaryStyle] || styleInsights.modern;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border-b border-cream-200">
        <div className="max-w-4xl mx-auto px-3 md:px-6 py-8 md:py-16 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-ink-900 flex items-center justify-center">
            <span className="text-3xl md:text-4xl font-serif">
              {insight.icon}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 md:mb-4 tracking-tight">
            Your Style Profile
          </h1>

          <p className="text-sm md:text-lg text-ink-700 max-w-2xl mx-auto leading-relaxed font-light px-3">
            {summary}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 md:px-6 py-6 md:py-12">
        {/* Core Aesthetic */}
        <div className="card-luxury p-4 md:p-10 mb-6 md:mb-8">
          <h2 className="text-xs md:text-sm font-semibold tracking-widest uppercase text-ink-600 mb-4 md:mb-6">
            Core Aesthetic
          </h2>

          <div className="space-y-4 md:space-y-6">
            {topStyles?.map((style, idx) => (
              <div key={idx} className="border-l-2 border-gold-400 pl-3 md:pl-6">
                <h3 className="text-lg md:text-xl font-serif font-bold mb-1 md:mb-2 capitalize">
                  {style}
                </h3>
                <p className="text-sm md:text-base text-ink-600 font-light leading-relaxed">
                  {styleInsights[style]?.description || 'A sophisticated approach to personal style.'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="card-luxury p-4 md:p-10 mb-6 md:mb-8">
          <h2 className="text-xs md:text-sm font-semibold tracking-widest uppercase text-ink-600 mb-4 md:mb-6">
            Color Narrative
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {topTags?.map((tag, idx) => (
              <div key={idx} className="border border-cream-200 p-3 md:p-6 text-center hover:border-gold-400 transition-colors duration-300">
                <div className="text-xs md:text-sm font-light text-ink-900 capitalize">
                  {tag.replace('-', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Style Insights */}
        <div className="card-luxury p-4 md:p-10 mb-6 md:mb-8">
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="w-full flex items-center justify-between group"
          >
            <h2 className="text-xs md:text-sm font-semibold tracking-widest uppercase text-ink-600">
              Curated Guidance
            </h2>
            <svg
              className={`h-4 w-4 md:h-5 md:w-5 transform transition-transform duration-300 text-ink-900 group-hover:text-gold-500 ${
                showInsights ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showInsights && (
            <div className="mt-4 md:mt-8 space-y-3 md:space-y-4 animate-fade-in">
              {insight.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start space-x-3 md:space-x-4 py-3 md:py-4 border-t border-cream-200 first:border-t-0">
                  <div className="text-gold-500 text-xs md:text-sm font-serif mt-1">
                    {idx + 1}
                  </div>
                  <p className="flex-1 text-sm md:text-base text-ink-700 leading-relaxed font-light">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card-luxury p-10 text-center">
            <div className="text-4xl font-serif font-bold text-gold-500 mb-2">
              {topStyles?.length || 0}
            </div>
            <div className="text-sm tracking-widest uppercase text-ink-600">
              Aesthetic Elements
            </div>
          </div>

          <div className="card-luxury p-10 text-center">
            <div className="text-4xl font-serif font-bold text-gold-500 mb-2">
              {topTags?.length || 0}
            </div>
            <div className="text-sm tracking-widest uppercase text-ink-600">
              Color Themes
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={onRefresh}
              className="btn-outline rounded-none w-full"
            >
              Refine My Profile
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="btn-gold rounded-none w-full"
            >
              Settings & API Key
            </button>
          </div>

          <div className="card-luxury p-8">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="font-serif text-lg mb-2">Privacy Commitment</h3>
                <p className="text-sm text-ink-600 font-light leading-relaxed">
                  Your style profile exists exclusively on your device. We employ no external tracking,
                  no cloud storage, and no data sharing. Your aesthetic journey remains entirely yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}
