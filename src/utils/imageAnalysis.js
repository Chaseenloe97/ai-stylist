/**
 * Local image analysis utilities
 * All processing happens client-side - no data is sent anywhere
 */

/**
 * Extract dominant colors from an image using Canvas API
 */
export const extractColors = (imageElement) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Sample pixels (every 10th pixel for performance)
    const colorMap = {};
    for (let i = 0; i < pixels.length; i += 40) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      // Skip very dark or very light pixels
      const brightness = (r + g + b) / 3;
      if (brightness < 30 || brightness > 225) continue;

      const colorKey = `${Math.floor(r/30)}-${Math.floor(g/30)}-${Math.floor(b/30)}`;
      colorMap[colorKey] = (colorMap[colorKey] || 0) + 1;
    }

    // Get top colors
    const sortedColors = Object.entries(colorMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([key]) => {
        const [r, g, b] = key.split('-').map(v => v * 30 + 15);
        return { r, g, b };
      });

    resolve(sortedColors);
  });
};

/**
 * Analyze color palette and return style tags
 */
export const analyzeColorPalette = (colors) => {
  const tags = [];

  colors.forEach(({ r, g, b }) => {
    const brightness = (r + g + b) / 3;
    const saturation = Math.max(r, g, b) - Math.min(r, g, b);

    // Neutral tones
    if (saturation < 30) {
      if (brightness < 80) tags.push('dark-neutrals');
      else if (brightness > 180) tags.push('light-neutrals');
      else tags.push('neutral-tones');
    }

    // Warm vs cool
    if (r > g && r > b) tags.push('warm-tones');
    if (b > r && b > g) tags.push('cool-tones');

    // Monochrome
    if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
      tags.push('monochrome');
    }
  });

  return [...new Set(tags)];
};

/**
 * Mock style inference based on color analysis
 */
export const inferStyle = (colorTags) => {
  const styleMap = {
    'neutral-tones': ['minimalist', 'modern', 'sophisticated'],
    'monochrome': ['minimalist', 'contemporary', 'clean'],
    'dark-neutrals': ['edgy', 'urban', 'streetwear'],
    'light-neutrals': ['soft', 'casual', 'relaxed'],
    'warm-tones': ['earthy', 'bohemian', 'cozy'],
    'cool-tones': ['crisp', 'professional', 'polished']
  };

  const styles = new Set();
  colorTags.forEach(tag => {
    if (styleMap[tag]) {
      styleMap[tag].forEach(style => styles.add(style));
    }
  });

  return Array.from(styles).slice(0, 3);
};

/**
 * Generate a style summary from multiple images
 */
export const generateStyleSummary = (allColorTags, allStyles) => {
  // Count frequency of tags
  const tagFrequency = {};
  allColorTags.flat().forEach(tag => {
    tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
  });

  const topTags = Object.entries(tagFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([tag]) => tag);

  // Count frequency of styles
  const styleFrequency = {};
  allStyles.flat().forEach(style => {
    styleFrequency[style] = (styleFrequency[style] || 0) + 1;
  });

  const topStyles = Object.entries(styleFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([style]) => style);

  // Generate description
  const descriptions = [
    `Your vibe: ${topStyles.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' + ')}`,
    `You lean towards ${topTags.join(', ')} color palettes`,
    `Style essence: ${topStyles[0]} with ${topStyles[1]} influences`
  ];

  return {
    summary: descriptions[Math.floor(Math.random() * descriptions.length)],
    topStyles,
    topTags
  };
};
