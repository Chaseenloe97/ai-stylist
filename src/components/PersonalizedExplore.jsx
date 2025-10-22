import { useState, useEffect } from 'react';
import { getApiKey, chatWithVic } from '../services/openai';

export default function PersonalizedExplore() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatSummary, setChatSummary] = useState('');

  // Curated fashion image IDs from Unsplash
  const fashionImages = [
    'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&h=600&fit=crop',
  ];

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

        const analysisPrompt = `Based on this user's recent chat history and their analyzed style profile, recommend 9 specific outfit combinations that match their aesthetic.

User's chat history:
${userMessages}

${parsedProfile ? `User's style profile:
- Top Styles: ${parsedProfile.topStyles?.join(', ')}
- Color Palette: ${parsedProfile.topTags?.join(', ')}
- Aesthetic Traits: ${parsedProfile.aestheticTraits?.join(', ')}
- Lifestyle: ${parsedProfile.lifestyle}
- Luxury Preferences: ${parsedProfile.luxuryProfile}` : ''}

Provide 9 outfit recommendations in this EXACT JSON format:
{
  "summary": "A brief 1-sentence summary of what the user is looking for",
  "outfits": [
    {
      "title": "Outfit name",
      "description": "Why this works for them",
      "items": ["Item 1 description (e.g., 'Navy wool blazer')", "Item 2 description", "Item 3 description"],
      "priceRange": "$XXX-$XXX",
      "occasion": "casual/professional/formal",
      "searchQuery": "specific search term for Unsplash photo",
      "shoppingLinks": [
        {"item": "Specific product with brand (e.g., 'Suitsupply Lazio Navy Blazer')", "url": "https://www.google.com/search?q=brand+item&tbm=shop"}
      ]
    }
  ]
}

IMPORTANT:
- "items" should be GENERIC descriptions of the outfit pieces (e.g., "Navy blazer", "White dress shirt")
- "shoppingLinks" should be SPECIFIC branded products to shop (e.g., "Brooks Brothers Milano Fit Blazer", "Charles Tyrwhitt Non-Iron Shirt")
- Make sure these are DIFFERENT - items are what's IN the outfit, shoppingLinks are WHERE to buy similar items

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
          { item: "Everlane Oxford Shirt", url: "https://www.google.com/search?q=everlane+oxford+shirt&tbm=shop" },
          { item: "Uniqlo Smart Ankle Pants", url: "https://www.google.com/search?q=uniqlo+smart+ankle+pants&tbm=shop" },
          { item: "Common Projects Achilles Low", url: "https://www.google.com/search?q=common+projects+achilles+low&tbm=shop" }
        ]
      },
      {
        title: "Smart Casual",
        description: "Polished yet relaxed for work or weekend",
        items: ["Navy blazer", "Light blue oxford shirt", "Khaki chinos", "Brown loafers"],
        priceRange: "$400-$700",
        occasion: "professional",
        searchQuery: "smart casual blazer man style",
        shoppingLinks: [
          { item: "J.Crew Ludlow Blazer", url: "https://www.google.com/search?q=jcrew+ludlow+blazer&tbm=shop" },
          { item: "Brooks Brothers Non-Iron Shirt", url: "https://www.google.com/search?q=brooks+brothers+non+iron+shirt&tbm=shop" },
          { item: "Bonobos Weekday Warrior Pants", url: "https://www.google.com/search?q=bonobos+weekday+warrior+pants&tbm=shop" }
        ]
      },
      {
        title: "Weekend Ready",
        description: "Comfortable and stylish for casual outings",
        items: ["Grey crewneck sweater", "Dark wash jeans", "White sneakers"],
        priceRange: "$150-$300",
        occasion: "casual",
        searchQuery: "casual weekend outfit men jeans",
        shoppingLinks: [
          { item: "Banana Republic Italian Merino Sweater", url: "https://www.google.com/search?q=banana+republic+merino+sweater&tbm=shop" },
          { item: "Levi's 511 Slim Fit Jeans", url: "https://www.google.com/search?q=levis+511+slim+fit&tbm=shop" },
          { item: "Adidas Stan Smith", url: "https://www.google.com/search?q=adidas+stan+smith&tbm=shop" }
        ]
      },
      {
        title: "Business Professional",
        description: "Command the boardroom with confidence",
        items: ["Charcoal grey suit", "White dress shirt", "Burgundy silk tie", "Black cap-toe oxfords"],
        priceRange: "$600-$1200",
        occasion: "formal",
        searchQuery: "business suit professional men",
        shoppingLinks: [
          { item: "Suitsupply Napoli Charcoal Suit", url: "https://www.google.com/search?q=suitsupply+napoli+charcoal+suit&tbm=shop" },
          { item: "Charles Tyrwhitt Poplin Shirt", url: "https://www.google.com/search?q=charles+tyrwhitt+poplin+shirt&tbm=shop" },
          { item: "Allen Edmonds Park Avenue", url: "https://www.google.com/search?q=allen+edmonds+park+avenue&tbm=shop" }
        ]
      },
      {
        title: "Streetwear Edge",
        description: "Urban style with modern attitude",
        items: ["Oversized hoodie", "Tapered joggers", "High-top sneakers"],
        priceRange: "$200-$450",
        occasion: "casual",
        searchQuery: "streetwear hoodie urban fashion",
        shoppingLinks: [
          { item: "Champion Reverse Weave Hoodie", url: "https://www.google.com/search?q=champion+reverse+weave+hoodie&tbm=shop" },
          { item: "Reigning Champ Slim Sweatpants", url: "https://www.google.com/search?q=reigning+champ+sweatpants&tbm=shop" },
          { item: "Nike Air Force 1 High", url: "https://www.google.com/search?q=nike+air+force+1+high&tbm=shop" }
        ]
      },
      {
        title: "Coastal Casual",
        description: "Effortless beach-to-bar versatility",
        items: ["Linen shirt", "Tailored shorts", "Leather sandals"],
        priceRange: "$180-$350",
        occasion: "casual",
        searchQuery: "coastal casual linen summer",
        shoppingLinks: [
          { item: "Faherty Brand Linen Shirt", url: "https://www.google.com/search?q=faherty+linen+shirt&tbm=shop" },
          { item: "Outlier New Way Shorts", url: "https://www.google.com/search?q=outlier+new+way+shorts&tbm=shop" },
          { item: "Rainbow Double Layer Sandals", url: "https://www.google.com/search?q=rainbow+double+layer+sandals&tbm=shop" }
        ]
      },
      {
        title: "Tech Exec",
        description: "Silicon Valley polish meets comfort",
        items: ["Merino quarter-zip", "Dark indigo jeans", "Minimalist sneakers"],
        priceRange: "$400-$800",
        occasion: "professional",
        searchQuery: "tech executive casual style",
        shoppingLinks: [
          { item: "Icebreaker Merino 260 Tech", url: "https://www.google.com/search?q=icebreaker+merino+260+tech&tbm=shop" },
          { item: "A.P.C. Petit Standard Jeans", url: "https://www.google.com/search?q=apc+petit+standard&tbm=shop" },
          { item: "Allbirds Wool Runners", url: "https://www.google.com/search?q=allbirds+wool+runners&tbm=shop" }
        ]
      },
      {
        title: "Evening Out",
        description: "Date night or dinner with style",
        items: ["Black turtleneck", "Grey wool trousers", "Suede chelsea boots"],
        priceRange: "$350-$600",
        occasion: "casual",
        searchQuery: "evening date night outfit men",
        shoppingLinks: [
          { item: "Uniqlo Extra Fine Merino Turtleneck", url: "https://www.google.com/search?q=uniqlo+merino+turtleneck&tbm=shop" },
          { item: "Massimo Dutti Wool Trousers", url: "https://www.google.com/search?q=massimo+dutti+wool+trousers&tbm=shop" },
          { item: "Thursday Boot Company Duke", url: "https://www.google.com/search?q=thursday+boots+duke&tbm=shop" }
        ]
      },
      {
        title: "Athletic Refined",
        description: "Gym to coffee shop transition",
        items: ["Performance polo", "Athletic joggers", "Training sneakers"],
        priceRange: "$180-$320",
        occasion: "casual",
        searchQuery: "athletic casual athleisure men",
        shoppingLinks: [
          { item: "Lululemon Metal Vent Tech Polo", url: "https://www.google.com/search?q=lululemon+metal+vent+tech+polo&tbm=shop" },
          { item: "Nike Tech Fleece Joggers", url: "https://www.google.com/search?q=nike+tech+fleece+joggers&tbm=shop" },
          { item: "On Cloud 5 Running Shoes", url: "https://www.google.com/search?q=on+cloud+5&tbm=shop" }
        ]
      },
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
              <div className="relative aspect-[3/4] bg-gradient-to-br from-ink-900 to-ink-700 overflow-hidden">
                <img
                  src={fashionImages[idx % fashionImages.length]}
                  alt={outfit.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
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
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(item)}&tbm=shop`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-600 hover:text-gold-700 underline"
                        >
                          {item}
                        </a>
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
