/**
 * Vic's Personality & Responses
 * A sophisticated, knowledgeable fashion curator with a warm, elevated tone
 */

import { getRandomProducts, getProductsByStyle, products } from './productDatabase';

const vicGreetings = [
  "Welcome back. I've been considering your aesthetic — shall we explore further?",
  "Delighted to see you. Your style journey awaits.",
  "Good to have you here. Let's refine your wardrobe narrative together.",
];

const vicStyleAdvice = {
  minimalist: [
    "For your minimalist sensibility, I recommend investing in architectural pieces with clean lines. Consider The Row or Lemaire for that understated sophistication.",
    "The beauty of minimalism lies in precision. A well-tailored trouser in a neutral tone will serve you infinitely better than a dozen trend pieces.",
    "Your aesthetic thrives on restraint. When in doubt, ask: does this piece elevate my existing wardrobe, or merely occupy space?",
  ],
  streetwear: [
    "Urban edge meets considered design. I'd suggest exploring brands like Jacquemus or Helmut Lang — they bridge the gap beautifully.",
    "Streetwear at its finest is about proportion and unexpected pairings. An oversized coat over slim trousers creates that effortless tension you're after.",
    "Your style speaks to cultural awareness. Vintage band tees paired with tailored pieces — that's the sweet spot.",
  ],
  bohemian: [
    "The bohemian spirit is about curated eclecticism. Think layered textures, artisanal details, and pieces with provenance.",
    "I love your free-spirited approach. Flowing silhouettes in natural fabrics — linen, silk, cotton — these materials breathe with you.",
    "Bohemian style is deeply personal. Each piece should tell a story. Vintage markets and independent designers are your hunting grounds.",
  ],
  professional: [
    "Polished professionalism is an art form. Invest in impeccable tailoring — a well-structured blazer is worth its weight in gold.",
    "Your wardrobe should command respect while expressing individuality. Subtle details matter: horn buttons, peak lapels, a perfect sleeve length.",
    "Professional doesn't mean predictable. A bold silk scarf or unexpected color in an otherwise neutral palette shows confidence.",
  ],
  modern: [
    "Modern style is about understanding proportion and contemporary silhouettes. Experiment with architectural shapes and innovative textiles.",
    "Clean, forward-thinking design suits you. Brands like COS, Jil Sander, or Acne Studios align with your aesthetic.",
    "The modern wardrobe balances form and function. Every piece should be purposeful yet beautiful.",
  ],
};

const vicQuestions = [
  "What occasion are you dressing for? Context shapes everything.",
  "Tell me about the pieces you already love — they reveal your authentic style.",
  "Which colors make you feel most yourself?",
  "What's your relationship with trends? Do you embrace or resist them?",
];

const vicCompliments = [
  "Your eye for detail is exceptional.",
  "That's a sophisticated choice — I can see you've been paying attention.",
  "You're developing a distinctly refined aesthetic. Well done.",
  "This shows real understanding of style principles. Impressive.",
];

const vicProductDescriptions = [
  {
    brand: "The Row",
    item: "Margaux Tote",
    price: "$5,200",
    description: "Timeless craftsmanship. A lifetime investment."
  },
  {
    brand: "Lemaire",
    item: "Cropped Jacket",
    price: "$1,150",
    description: "Architectural yet wearable. Perfect for your aesthetic."
  },
  {
    brand: "COS",
    item: "Relaxed Trousers",
    price: "$135",
    description: "Accessible luxury. Excellent quality-to-price ratio."
  },
  {
    brand: "Acne Studios",
    item: "Minimal Sneaker",
    price: "$420",
    description: "Scandinavian design at its finest."
  },
  {
    brand: "Totême",
    item: "Silk Blouse",
    price: "$470",
    description: "Refined simplicity that elevates any look."
  },
  {
    brand: "Jil Sander",
    item: "Cashmere Sweater",
    price: "$890",
    description: "The ultimate in understated luxury."
  },
];

export const getVicGreeting = (styleProfile) => {
  const greeting = vicGreetings[Math.floor(Math.random() * vicGreetings.length)];

  if (styleProfile && styleProfile.topStyles) {
    const style = styleProfile.topStyles[0];
    return `${greeting}\n\nI notice your ${style} sensibility — quite refined. How may I assist you today?`;
  }

  return greeting;
};

export const generateVicResponse = (message, styleProfile) => {
  const lowerMessage = message.toLowerCase();
  const style = styleProfile?.topStyles?.[0] || 'modern';

  // Greetings
  if (lowerMessage.match(/\b(hi|hey|hello|good morning|good afternoon|good evening)\b/)) {
    return `Hello! Lovely to hear from you. I'm here to help with any style questions you might have. What's on your mind today?`;
  }

  // Color questions
  if (lowerMessage.match(/\b(color|colour|colors|colours)\b/)) {
    const colorAdvice = {
      minimalist: "For your minimalist aesthetic, I recommend building a foundation in neutrals — black, white, navy, beige, and grey. These create endless versatility. Add one or two accent colors sparingly for visual interest.",
      streetwear: "Your urban sensibility pairs well with bold color blocking. Try pairing neutrals (black, white, grey) with pops of vibrant color — deep burgundy, forest green, or even a statement orange. Don't be afraid to experiment.",
      bohemian: "Embrace earthy, natural tones — terracotta, olive, rust, cream, and warm browns. These colors reflect nature and pair beautifully with artisanal textures. Add pops of jewel tones for richness.",
      professional: "A professional palette centers on navy, charcoal, white, and light blue. These convey authority and refinement. Add burgundy, forest green, or camel for subtle sophistication without being loud.",
      modern: "Modern style thrives on clean color palettes. Try monochromatic looks in varying shades, or high-contrast combinations like black and white. Incorporate one statement color like cobalt blue or deep red."
    };
    return colorAdvice[style] || colorAdvice.modern;
  }

  // Shopping/buying/brands
  if (lowerMessage.match(/\b(buy|shop|find|brand|store|where|recommend|purchase)\b/)) {
    // Determine what they're looking for
    let category = null;
    let productList = [];

    if (lowerMessage.match(/\b(shirt|tee|t-shirt|top|sweater|hoodie)\b/i)) {
      category = 'tops';
      productList = getProductsByStyle('tops', style);
    } else if (lowerMessage.match(/\b(pant|pants|jean|jeans|trouser|chino)\b/i)) {
      category = 'bottoms';
      productList = getProductsByStyle('bottoms', style);
    } else if (lowerMessage.match(/\b(shoe|shoes|sneaker|boot|boots|footwear)\b/i)) {
      category = 'shoes';
      productList = getProductsByStyle('shoes', style);
    } else if (lowerMessage.match(/\b(jacket|coat|outerwear)\b/i)) {
      category = 'outerwear';
      productList = getProductsByStyle('outerwear', style);
    } else if (lowerMessage.match(/\b(bag|wallet|watch|backpack|accessory|accessories)\b/i)) {
      productList = products.accessories;
    } else {
      // General shopping - get mix of products
      productList = getRandomProducts(4, style);
    }

    // Get 3-4 recommendations
    const recommendations = productList.slice(0, 4);

    let response = category
      ? `Here are some ${category} I'd recommend for your ${style} aesthetic:\n\n`
      : `I've curated some essential pieces that align with your style:\n\n`;

    recommendations.forEach(p => {
      response += `**${p.brand}** — ${p.name}\n`;
      response += `${p.description}\n`;
      response += `${p.price} — [Shop Here](${p.url})\n\n`;
    });

    response += "\n*Pro tip: Click the links to purchase directly. These are pieces I genuinely recommend for their quality and style.*";
    return response;
  }

  // Capsule wardrobe
  if (lowerMessage.match(/\b(capsule|wardrobe|essential|basics|must-have|foundation)\b/)) {
    return `Building a capsule wardrobe is about intentionality. Here's what I recommend:\n\n**Foundation Pieces:**\n• Well-fitted white tee (2-3)\n• Perfect black or navy blazer\n• Quality denim in a classic cut\n• Tailored trousers in neutral tones\n• Versatile footwear: leather sneakers + dress shoes\n• Classic outerwear: trench or wool coat\n\nThese pieces work together infinitely. Add your personal style through accessories and statement pieces.`;
  }

  // Seasonal/weather
  if (lowerMessage.match(/\b(winter|summer|fall|autumn|spring|season|weather|cold|hot)\b/)) {
    if (lowerMessage.includes('winter') || lowerMessage.includes('cold')) {
      return "Winter dressing is about layering with purpose. Start with quality base layers, add a structured sweater or turtleneck, then finish with a wool coat or puffer. Don't forget: cashmere scarves and leather gloves elevate any winter look.";
    }
    if (lowerMessage.includes('summer') || lowerMessage.includes('hot')) {
      return "Summer calls for breathable fabrics — linen, cotton, lightweight silk. Loose silhouettes in light colors keep you cool while looking refined. Think crisp white shirts, linen trousers, and natural fabrics that move with you.";
    }
    return "Transitional seasons are perfect for layering. Lightweight knits, versatile blazers, and quality denim become your best friends. Build outfits you can add to or subtract from as temperatures shift.";
  }

  // Shoes/footwear
  if (lowerMessage.match(/\b(shoe|shoes|sneaker|boot|footwear|feet)\b/)) {
    const shoeRecs = getProductsByStyle('shoes', style).slice(0, 3);

    let response = "Footwear makes or breaks an outfit. Here are my top recommendations for you:\n\n";

    shoeRecs.forEach(shoe => {
      response += `**${shoe.brand}** — ${shoe.name}\n`;
      response += `${shoe.description}\n`;
      response += `${shoe.price} — [Shop Here](${shoe.url})\n\n`;
    });

    response += "Quality leather improves with age. Take care of your shoes and they'll serve you for years.";
    return response;
  }

  // Accessories
  if (lowerMessage.match(/\b(accessory|accessories|jewelry|watch|bag|belt|scarf|wallet|backpack)\b/)) {
    const accessoryRecs = products.accessories.slice(0, 3);

    let response = "Accessories are where personality shines. Here are some essentials:\n\n";

    accessoryRecs.forEach(item => {
      response += `**${item.brand}** — ${item.name}\n`;
      response += `${item.description}\n`;
      response += `${item.price} — [Shop Here](${item.url})\n\n`;
    });

    response += "**My philosophy:** Less is more. Choose one or two quality pieces rather than cluttering your look. Accessories should feel intentional, not accidental.";
    return response;
  }

  // Fit/tailoring
  if (lowerMessage.match(/\b(fit|fitting|tailor|tailoring|alter|size|sizing)\b/)) {
    return "Fit is everything. An affordable piece that fits perfectly will look better than an expensive piece that doesn't.\n\nKey fit principles:\n• Shoulders should align naturally\n• Sleeves should end at your wrist bone\n• Pants should break slightly on your shoe\n• Nothing should pull, bunch, or gap\n\nFind a good tailor. It's worth every penny.";
  }

  // Body type/shape
  if (lowerMessage.match(/\b(body|shape|figure|tall|short|slim|curvy)\b/)) {
    return "Style isn't about conforming to arbitrary standards — it's about understanding proportion and what makes you feel confident.\n\nGeneral principles:\n• Balance proportions (fitted top + loose bottom, or vice versa)\n• Vertical lines elongate\n• Proper fit always flatters\n• Wear what makes you feel powerful\n\nYour body is not the problem. Poorly designed or ill-fitting clothes are.";
  }

  // Matching/pairing
  if (lowerMessage.match(/\b(match|matching|pair|pairing|combine|go with|goes with)\b/)) {
    const advice = vicStyleAdvice[style] || vicStyleAdvice.modern;
    return advice[Math.floor(Math.random() * advice.length)] + "\n\nWhen pairing pieces, think about:\n• Color harmony (complementary or monochromatic)\n• Texture contrast (smooth with textured)\n• Proportion balance (fitted with loose)\n• Formality level (keep it consistent)";
  }

  // Budget/affordable
  if (lowerMessage.match(/\b(budget|cheap|affordable|expensive|cost|price)\b/)) {
    return "Style isn't about money — it's about curation and care.\n\n**Smart shopping strategies:**\n• Buy fewer, better quality pieces\n• Explore vintage and secondhand\n• Focus on timeless over trendy\n• Take care of what you own\n• Invest in alterations\n\nBrands like COS, Uniqlo, and Everlane offer excellent quality at accessible prices. Mix high and low thoughtfully.";
  }

  // Trends
  if (lowerMessage.match(/\b(trend|trendy|trending|fashion|current|latest)\b/)) {
    return "Trends are interesting to observe but dangerous to chase blindly.\n\nMy approach: If a trend resonates with your existing aesthetic, incorporate it selectively. If it doesn't, ignore it entirely.\n\nRemember: personal style transcends trends. Build a wardrobe that feels authentically you, and you'll always look current.";
  }

  // Confidence/insecure
  if (lowerMessage.match(/\b(confidence|confident|insecure|uncomfortable|unsure)\b/)) {
    return "Confidence is the best thing you can wear — and it comes from feeling authentic in your clothes.\n\nStart here:\n• Identify what makes you feel good (not what you think you *should* wear)\n• Ensure everything fits properly\n• Build gradually — don't overhaul your wardrobe overnight\n• Wear your clothes; don't let them wear you\n\nStyle is a journey, not a destination. Be patient with yourself.";
  }

  // Questions with question marks
  if (lowerMessage.includes('?')) {
    const advice = vicStyleAdvice[style] || vicStyleAdvice.modern;
    return advice[Math.floor(Math.random() * advice.length)];
  }

  // Default responses based on message sentiment
  if (lowerMessage.match(/\b(like|love|great|amazing|beautiful|gorgeous)\b/)) {
    return vicCompliments[Math.floor(Math.random() * vicCompliments.length)] + "\n\nWhat specifically draws you to this? Understanding your instincts helps refine your aesthetic.";
  }

  // Help/guidance requests
  if (lowerMessage.match(/\b(help|advice|suggest|suggestion|guide|guidance)\b/)) {
    const advice = vicStyleAdvice[style] || vicStyleAdvice.modern;
    return "Of course, I'm here to help. " + advice[Math.floor(Math.random() * advice.length)];
  }

  // Thoughtful default responses
  const responses = [
    "That's an interesting point. Could you tell me more about what you're looking to achieve?",
    "I appreciate your thoughtfulness about this. Let's explore that together — what specific aspect interests you most?",
    "An excellent question. The answer depends on your personal context. Tell me more about how you envision this working for you?",
    "Let's think through this carefully. What's driving this question — is it for a specific occasion or more general guidance?",
    "I'm here to help you discover what works for *you*. What's the broader context behind this question?",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

export const analyzeImageWithVic = (styleProfile) => {
  const responses = [
    "Exquisite choice. The silhouette here is particularly well-considered.",
    "I can see why this appeals to you — it aligns perfectly with your established aesthetic.",
    "The color palette here is sublime. Notice how the tones create visual harmony.",
    "This piece shows real understanding of proportion. Well spotted.",
    "A sophisticated selection. This would integrate beautifully with your existing wardrobe.",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

export const vicQuickSuggestions = [
  "What should I invest in this season?",
  "Help me build a capsule wardrobe",
  "How do I elevate my basics?",
];
