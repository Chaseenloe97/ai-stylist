/**
 * Mock AI responses for the chat interface
 * In production, this would connect to GPT-4-Vision or Claude
 */

const styleResponses = {
  minimalist: [
    "Try relaxed beige chinos — they'll balance the structure beautifully.",
    "I'd suggest keeping it simple with white sneakers or leather loafers.",
    "A monochrome palette would work perfectly with your aesthetic.",
    "Less is more — stick with clean lines and neutral tones."
  ],
  streetwear: [
    "Cargo pants or relaxed denim would complement that vibe.",
    "Try layering with an oversized hoodie or bomber jacket.",
    "High-top sneakers would complete this look perfectly.",
    "Mix in some graphic pieces to add visual interest."
  ],
  bohemian: [
    "Flowing fabrics and earth tones would enhance this style.",
    "Layer with a kimono or oversized cardigan.",
    "Add texture with woven accessories or leather details.",
    "Warm colors like rust, terracotta, or olive would work well."
  ],
  professional: [
    "Tailored trousers in navy or charcoal would be ideal.",
    "Keep it polished with structured pieces and crisp fabrics.",
    "Loafers or oxford shoes would complete this look.",
    "Stick to a neutral color palette for maximum versatility."
  ]
};

const shoppingResponses = [
  "Here are some similar pieces I found:\n• Everlane Relaxed Chino ($88)\n• COS Tapered Trousers ($99)\n• Uniqlo Smart Ankle Pants ($49)",
  "I found these matches for your style:\n• Reformation Denim Jacket ($178)\n• Levi's Trucker Jacket ($98)\n• Madewell Oversized Jean Jacket ($128)",
  "Check out these options:\n• Veja Campo Sneakers ($150)\n• Axel Arigato Clean 90 ($225)\n• Common Projects Achilles Low ($425)",
  "These would work well:\n• Entireworld Sweatshirt ($88)\n• Lady White Co. Tee ($65)\n• Kotn Crew Neck ($48)"
];

const generalResponses = [
  "That's a great question! Based on your style, I'd recommend focusing on versatile basics.",
  "I can help with that! Your minimalist aesthetic pairs well with clean silhouettes.",
  "Absolutely! Let me break down what would work best for you.",
  "Great choice! That aligns perfectly with your style profile."
];

/**
 * Generate a contextual AI response based on user message
 */
export const generateResponse = (message, userStyle = ['minimalist']) => {
  const lowerMessage = message.toLowerCase();

  // Detect intent
  if (lowerMessage.includes('buy') || lowerMessage.includes('shop') || lowerMessage.includes('find')) {
    return shoppingResponses[Math.floor(Math.random() * shoppingResponses.length)];
  }

  if (lowerMessage.includes('match') || lowerMessage.includes('go with') || lowerMessage.includes('pair')) {
    const primaryStyle = userStyle[0] || 'minimalist';
    const responses = styleResponses[primaryStyle] || styleResponses.minimalist;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (lowerMessage.includes('style') || lowerMessage.includes('aesthetic') || lowerMessage.includes('vibe')) {
    return `Your ${userStyle.join(' + ')} style is all about balance and intention. ${styleResponses[userStyle[0] || 'minimalist'][0]}`;
  }

  // Default response
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};

/**
 * Analyze uploaded image and return style feedback
 */
export const analyzeImageForChat = (styleProfile) => {
  const feedback = [
    `I can see this has ${styleProfile.topTags?.[0] || 'neutral'} tones — very on-brand for you!`,
    `This fits your ${styleProfile.topStyles?.[0] || 'minimalist'} aesthetic perfectly.`,
    `The color palette here complements your existing style profile.`,
    `I love this! It has that ${styleProfile.topStyles?.[0] || 'clean'} look you gravitate towards.`
  ];

  return feedback[Math.floor(Math.random() * feedback.length)];
};

/**
 * Mock product recognition from image
 */
export const recognizeProducts = () => {
  const mockProducts = [
    { brand: 'Everlane', item: 'Cashmere Crew', price: '$100' },
    { brand: 'COS', item: 'Relaxed Trousers', price: '$99' },
    { brand: 'Veja', item: 'Campo Sneakers', price: '$150' },
    { brand: 'Reformation', item: 'Linen Shirt', price: '$128' },
    { brand: 'Uniqlo', item: 'Supima Cotton Tee', price: '$19' },
    { brand: 'Madewell', item: 'Transport Tote', price: '$158' }
  ];

  const numItems = Math.floor(Math.random() * 2) + 1;
  const selected = [];

  for (let i = 0; i < numItems; i++) {
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    selected.push(product);
  }

  return selected;
};

/**
 * Generate outfit suggestions
 */
export const suggestOutfit = (userStyle) => {
  const outfits = {
    minimalist: [
      "White tee + black trousers + white sneakers",
      "Beige sweater + cream pants + loafers",
      "Black turtleneck + grey jeans + chelsea boots"
    ],
    streetwear: [
      "Oversized hoodie + cargo pants + high-tops",
      "Graphic tee + distressed denim + chunky sneakers",
      "Bomber jacket + joggers + retro sneakers"
    ],
    bohemian: [
      "Flowy blouse + wide-leg pants + sandals",
      "Oversized cardigan + midi skirt + ankle boots",
      "Linen shirt + high-waist jeans + woven bag"
    ]
  };

  const style = userStyle[0] || 'minimalist';
  const suggestions = outfits[style] || outfits.minimalist;

  return suggestions[Math.floor(Math.random() * suggestions.length)];
};
