import { useState, useEffect } from 'react';

export default function Explore({ styleProfile }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [outfitSuggestions, setOutfitSuggestions] = useState([]);

  useEffect(() => {
    if (styleProfile) {
      generateOutfitSuggestions();
    }
  }, [styleProfile, selectedCategory]);

  const generateOutfitSuggestions = () => {
    const style = styleProfile?.topStyles?.[0] || 'modern';

    const outfitsByStyle = {
      minimalist: [
        {
          id: 1,
          title: 'Monochrome Elegance',
          description: 'Clean lines and neutral tones create timeless sophistication',
          pieces: ['Black turtleneck', 'Tailored grey trousers', 'White leather sneakers'],
          occasion: 'casual',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'
        },
        {
          id: 2,
          title: 'Effortless Neutral',
          description: 'Understated pieces that speak volumes through quality',
          pieces: ['Cream cashmere sweater', 'Beige wide-leg pants', 'Tan loafers'],
          occasion: 'professional',
          season: 'fall',
          image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80'
        },
        {
          id: 3,
          title: 'Structured Minimalism',
          description: 'Architectural silhouettes in a refined palette',
          pieces: ['White button-down', 'Black blazer', 'Grey slim pants', 'Black oxfords'],
          occasion: 'professional',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80'
        },
        {
          id: 4,
          title: 'Weekend Minimal',
          description: 'Relaxed yet intentional weekend styling',
          pieces: ['Oversized white tee', 'Black jeans', 'White sneakers', 'Beige tote'],
          occasion: 'casual',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'
        },
        {
          id: 21,
          title: 'Refined Simplicity',
          description: 'Elevated basics in a monochromatic palette',
          pieces: ['Black mock neck', 'Wide-leg trousers', 'Leather slides'],
          occasion: 'casual',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80'
        },
        {
          id: 22,
          title: 'Timeless Tailoring',
          description: 'Precision cut pieces that never go out of style',
          pieces: ['Structured coat', 'Black turtleneck', 'Slim trousers'],
          occasion: 'professional',
          season: 'winter',
          image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80'
        }
      ],
      streetwear: [
        {
          id: 5,
          title: 'Urban Edge',
          description: 'Contemporary street style with refined touches',
          pieces: ['Oversized hoodie', 'Cargo pants', 'High-top sneakers'],
          occasion: 'casual',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1504198266287-1659872e6590?w=800&q=80'
        },
        {
          id: 6,
          title: 'Layered Street',
          description: 'Mix textures and proportions for visual interest',
          pieces: ['Graphic tee', 'Bomber jacket', 'Distressed denim', 'Chunky sneakers'],
          occasion: 'casual',
          season: 'spring',
          image: 'https://images.unsplash.com/photo-1558769132-cb1aea841c50?w=800&q=80'
        },
        {
          id: 7,
          title: 'Athletic Luxe',
          description: 'Sportswear meets elevated design',
          pieces: ['Tech jacket', 'Joggers', 'Performance sneakers', 'Crossbody bag'],
          occasion: 'casual',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80'
        },
        {
          id: 23,
          title: 'Downtown Cool',
          description: 'Effortless urban style with edge',
          pieces: ['Oversized tee', 'Relaxed jeans', 'Statement sneakers', 'Baseball cap'],
          occasion: 'casual',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80'
        },
        {
          id: 24,
          title: 'Street Luxe',
          description: 'High-end streetwear with designer touches',
          pieces: ['Premium hoodie', 'Tailored track pants', 'Designer sneakers'],
          occasion: 'casual',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80'
        }
      ],
      professional: [
        {
          id: 8,
          title: 'Power Dressing',
          description: 'Command attention with impeccable tailoring',
          pieces: ['Navy suit', 'White dress shirt', 'Silk tie', 'Oxford shoes'],
          occasion: 'professional',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&q=80'
        },
        {
          id: 9,
          title: 'Smart Casual',
          description: 'Polished without being overly formal',
          pieces: ['Blazer', 'Chambray shirt', 'Chinos', 'Loafers'],
          occasion: 'professional',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80'
        },
        {
          id: 25,
          title: 'Modern Professional',
          description: 'Contemporary take on office attire',
          pieces: ['Structured blazer', 'Slim trousers', 'Leather loafers', 'Minimalist watch'],
          occasion: 'professional',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'
        },
        {
          id: 26,
          title: 'Executive Elegance',
          description: 'Refined sophistication for important meetings',
          pieces: ['Charcoal suit', 'Crisp white shirt', 'Leather dress shoes', 'Briefcase'],
          occasion: 'professional',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=800&q=80'
        }
      ],
      bohemian: [
        {
          id: 10,
          title: 'Flowing Layers',
          description: 'Earthy tones and natural fabrics create effortless style',
          pieces: ['Linen blouse', 'Wide-leg pants', 'Woven sandals', 'Leather bag'],
          occasion: 'casual',
          season: 'summer',
          image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80'
        },
        {
          id: 11,
          title: 'Artisan Touch',
          description: 'Handcrafted details and vintage finds',
          pieces: ['Embroidered jacket', 'Maxi skirt', 'Ankle boots', 'Statement jewelry'],
          occasion: 'casual',
          season: 'fall',
          image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80'
        },
        {
          id: 27,
          title: 'Free Spirit',
          description: 'Natural textures and relaxed silhouettes',
          pieces: ['Oversized linen shirt', 'Flowing skirt', 'Leather sandals', 'Woven bag'],
          occasion: 'casual',
          season: 'summer',
          image: 'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=800&q=80'
        },
        {
          id: 28,
          title: 'Earthy Elegance',
          description: 'Bohemian sophistication with artisanal pieces',
          pieces: ['Crochet top', 'Wide-leg jeans', 'Suede boots', 'Vintage jewelry'],
          occasion: 'casual',
          season: 'fall',
          image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80'
        }
      ],
      modern: [
        {
          id: 29,
          title: 'Contemporary Clean',
          description: 'Forward-thinking design with architectural elements',
          pieces: ['Asymmetric top', 'Straight-leg pants', 'Minimal sneakers'],
          occasion: 'casual',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80'
        },
        {
          id: 30,
          title: 'Urban Modern',
          description: 'Clean lines meet contemporary edge',
          pieces: ['Structured jacket', 'Slim fit jeans', 'Designer sneakers'],
          occasion: 'casual',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80'
        },
        {
          id: 31,
          title: 'Avant-Garde Basics',
          description: 'Elevated essentials with modern proportions',
          pieces: ['Oversized blazer', 'Tailored trousers', 'Leather loafers'],
          occasion: 'professional',
          season: 'all',
          image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&q=80'
        }
      ]
    };

    let suggestions = outfitsByStyle[style] || outfitsByStyle.minimalist;

    if (selectedCategory !== 'all') {
      suggestions = suggestions.filter(outfit => outfit.occasion === selectedCategory);
    }

    setOutfitSuggestions(suggestions);
  };

  const categories = [
    { id: 'all', label: 'All Looks' },
    { id: 'casual', label: 'Casual' },
    { id: 'professional', label: 'Professional' }
  ];

  if (!styleProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center px-6 pt-16">
        <div className="max-w-xl text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-cream-100 border-2 border-cream-200 flex items-center justify-center">
            <svg className="h-12 w-12 text-ink-900/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <h2 className="text-3xl font-serif font-bold text-ink-900 mb-4">
            Discover Your Style First
          </h2>
          <p className="text-ink-600 mb-8 leading-relaxed font-light">
            Upload photos to build your style profile, then Vic will curate personalized outfit recommendations just for you.
          </p>

          <div className="card-luxury p-6 text-left">
            <h3 className="font-serif text-lg font-bold mb-3">How It Works</h3>
            <ol className="space-y-3 text-sm text-ink-600">
              <li className="flex items-start">
                <span className="text-gold-500 mr-3 font-serif">1.</span>
                <span className="font-light">Upload photos on the Discover page</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-500 mr-3 font-serif">2.</span>
                <span className="font-light">Vic analyzes your aesthetic preferences</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-500 mr-3 font-serif">3.</span>
                <span className="font-light">Return here for curated outfit suggestions</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight">
            Curated For You
          </h1>
          <p className="text-lg text-ink-700 max-w-2xl mx-auto font-light">
            Outfit recommendations tailored to your <span className="font-medium">{styleProfile.topStyles?.[0]}</span> aesthetic
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center justify-center space-x-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-ink-900 text-cream-50 shadow-lg'
                  : 'bg-white text-ink-900 border border-cream-200 hover:border-gold-400'
              }`}
            >
              <span className="text-sm font-medium tracking-wide">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Outfit Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {outfitSuggestions.map((outfit) => (
            <div key={outfit.id} className="card-luxury overflow-hidden group">
              {/* Image */}
              <div className="relative aspect-[3/4] bg-cream-100 overflow-hidden">
                <img
                  src={outfit.image}
                  alt={outfit.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="533"%3E%3Crect width="400" height="533" fill="%23EBEBDE"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="20" fill="%230A0A0A" opacity="0.3"%3EOutfit Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs text-white/80 mb-2 tracking-widest uppercase">
                      {outfit.occasion} • {outfit.season}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold mb-2">{outfit.title}</h3>
                <p className="text-sm text-ink-600 font-light mb-4 leading-relaxed">
                  {outfit.description}
                </p>

                {/* Pieces */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs tracking-widest uppercase text-ink-600 font-semibold">Pieces</p>
                  {outfit.pieces.map((piece, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-gold-400 mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-ink-700 font-light">{piece}</p>
                    </div>
                  ))}
                </div>

                {/* Action */}
                <button className="btn-outline rounded-none w-full text-sm py-3">
                  Ask Vic About This
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {outfitSuggestions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-ink-600 font-light">No outfits found for this category. Try selecting a different filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
