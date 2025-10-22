import { useState, useEffect } from 'react';
import { getApiKey, chatWithVic } from '../services/openai';

export default function PersonalizedExplore() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatSummary, setChatSummary] = useState('');

  useEffect(() => {
    generatePersonalizedRecommendations();
  }, []);

  const generatePersonalizedRecommendations = async () => {
    setIsLoading(true);

    // Get chat history from localStorage
    const chatHistory = localStorage.getItem('chatHistory');
    const styleProfile = localStorage.getItem('styleProfile');

    let parsedHistory = [];
    let parsedProfile = null;

    try {
      if (chatHistory) parsedHistory = JSON.parse(chatHistory);
      if (styleProfile) parsedProfile = JSON.parse(styleProfile);
    } catch (e) {
      console.error('Failed to parse saved data:', e);
    }

    // If no chat history, show generic recommendations
    if (!parsedHistory || parsedHistory.length === 0) {
      setRecommendations(getDefaultRecommendations());
      setChatSummary("Start chatting with Vic to get personalized recommendations!");
      setIsLoading(false);
      return;
    }

    // Use AI to analyze chat history and generate recommendations
    const hasApiKey = getApiKey();

    if (hasApiKey) {
      try {
        // Extract just user messages for analysis
        const userMessages = parsedHistory
          .filter(msg => msg.role === 'user')
          .map(msg => msg.content)
          .join('\n');

        const analysisPrompt = `Based on this user's recent chat history, identify their fashion interests and recommend 6 specific outfit combinations.

User's chat history:
${userMessages}

${parsedProfile ? `User's style profile: ${parsedProfile.topStyles?.join(', ')}` : ''}

Provide 6 outfit recommendations in this EXACT JSON format:
{
  "summary": "A brief 1-sentence summary of what the user is looking for",
  "outfits": [
    {
      "title": "Outfit name",
      "description": "Why this works for them",
      "items": ["Item 1 with brand", "Item 2 with brand", "Item 3 with brand"],
      "priceRange": "$XXX-$XXX",
      "occasion": "casual/professional/formal",
      "searchQuery": "specific search term for Unsplash photo",
      "shoppingLinks": [
        {"item": "Item name", "url": "https://www.google.com/search?q=brand+item&tbm=shop"}
      ]
    }
  ]
}

Make searchQuery very specific for finding good outfit photos on Unsplash (e.g., "man wearing navy suit", "woman in leather jacket street style").`;

        const response = await chatWithVic([], analysisPrompt, null, parsedProfile);

        // Parse JSON response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          setChatSummary(data.summary || '');
          setRecommendations(data.outfits || []);
        } else {
          setRecommendations(getDefaultRecommendations());
        }
      } catch (error) {
        console.error('Failed to generate AI recommendations:', error);
        setRecommendations(getDefaultRecommendations());
      }
    } else {
      setRecommendations(getDefaultRecommendations());
    }

    setIsLoading(false);
  };

  const getDefaultRecommendations = () => {
    return [
      {
        title: "Modern Minimalist",
        description: "Clean lines and neutral tones for everyday sophistication",
        items: ["White button-down shirt", "Black slim trousers", "White leather sneakers"],
        priceRange: "$200-$400",
        occasion: "casual",
        searchQuery: "minimalist fashion man white shirt",
        shoppingLinks: [
          { item: "White Oxford Shirt", url: "https://www.google.com/search?q=white+oxford+shirt+men&tbm=shop" },
          { item: "Black Slim Trousers", url: "https://www.google.com/search?q=black+slim+trousers+men&tbm=shop" }
        ]
      },
      {
        title: "Smart Casual",
        description: "Polished yet relaxed for work or weekend",
        items: ["Navy blazer", "Light blue OCBD", "Chinos", "Loafers"],
        priceRange: "$400-$700",
        occasion: "professional",
        searchQuery: "smart casual blazer man style",
        shoppingLinks: [
          { item: "Navy Blazer", url: "https://www.google.com/search?q=navy+blazer+men&tbm=shop" },
          { item: "Chino Pants", url: "https://www.google.com/search?q=khaki+chinos+men&tbm=shop" }
        ]
      },
      {
        title: "Weekend Ready",
        description: "Comfortable and stylish for casual outings",
        items: ["Grey crewneck sweater", "Dark denim", "White sneakers"],
        priceRange: "$150-$300",
        occasion: "casual",
        searchQuery: "casual weekend outfit men jeans",
        shoppingLinks: [
          { item: "Grey Sweater", url: "https://www.google.com/search?q=grey+crewneck+sweater&tbm=shop" },
          { item: "Dark Wash Jeans", url: "https://www.google.com/search?q=dark+wash+jeans+men&tbm=shop" }
        ]
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ink-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ink-600 font-light">Curating your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white pt-8 md:pt-12 pb-12">
      <div className="max-w-6xl mx-auto px-3 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 tracking-tight text-ink-900">
            Curated for You
          </h1>
          {chatSummary && (
            <p className="text-sm md:text-lg text-ink-700 max-w-3xl mx-auto font-light leading-relaxed">
              {chatSummary}
            </p>
          )}
          {!chatSummary && (
            <p className="text-sm md:text-lg text-ink-700 max-w-3xl mx-auto font-light">
              Based on your style preferences
            </p>
          )}
        </div>

        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {recommendations.map((outfit, idx) => (
            <div key={idx} className="card-luxury overflow-hidden group">
              {/* Image from Unsplash */}
              <div className="relative aspect-[3/4] bg-cream-100 overflow-hidden">
                <img
                  src={`https://source.unsplash.com/400x600/?${encodeURIComponent(outfit.searchQuery)}`}
                  alt={outfit.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = `https://source.unsplash.com/400x600/?fashion,${outfit.occasion}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <div className="text-white">
                      <p className="text-xs uppercase tracking-widest mb-2 opacity-80">
                        {outfit.occasion} • {outfit.priceRange}
                      </p>
                      <h3 className="font-serif text-xl md:text-2xl font-bold mb-2">
                        {outfit.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6">
                <p className="text-sm md:text-base text-ink-600 font-light mb-4 leading-relaxed">
                  {outfit.description}
                </p>

                {/* Items */}
                <div className="mb-4">
                  <p className="text-xs font-semibold tracking-widest uppercase text-ink-600 mb-2">
                    Key Pieces
                  </p>
                  <ul className="space-y-1">
                    {outfit.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-sm text-ink-700 font-light flex items-start">
                        <span className="text-gold-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Shopping Links */}
                {outfit.shoppingLinks && outfit.shoppingLinks.length > 0 && (
                  <div className="border-t border-cream-200 pt-4">
                    <p className="text-xs font-semibold tracking-widest uppercase text-ink-600 mb-3">
                      Shop Similar
                    </p>
                    <div className="space-y-2">
                      {outfit.shoppingLinks.map((link, linkIdx) => (
                        <a
                          key={linkIdx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-gold-600 hover:text-gold-700 font-medium underline"
                        >
                          {link.item} →
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-12">
          <button
            onClick={generatePersonalizedRecommendations}
            className="btn-secondary rounded-none px-8"
          >
            Refresh Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}
