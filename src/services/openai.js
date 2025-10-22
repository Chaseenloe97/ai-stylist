/**
 * OpenAI API Service for Vic AI Stylist
 * Handles GPT-4 Vision API calls for style analysis and chat
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Get API key from localStorage or environment variable
 */
export const getApiKey = () => {
  // Try localStorage first, then environment variable
  return localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY;
};

/**
 * Save API key to localStorage
 */
export const saveApiKey = (apiKey) => {
  localStorage.setItem('openai_api_key', apiKey);
};

/**
 * Remove API key from localStorage
 */
export const clearApiKey = () => {
  localStorage.removeItem('openai_api_key');
};

/**
 * Analyze images to create a style profile using GPT-4 Vision
 * @param {Array<string>} imageDataUrls - Array of base64 image data URLs
 * @returns {Promise<Object>} Style profile object
 */
export const analyzeStyleProfile = async (imageDataUrls) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add your API key in settings.');
  }

  // Limit to first 10 images to avoid token limits
  const imagesToAnalyze = imageDataUrls.slice(0, 10);

  const messages = [
    {
      role: 'system',
      content: `You are Vic, an elite fashion curator and style analyst. Analyze the provided images to understand the person's style preferences, aesthetic, and lifestyle. Be sophisticated, insightful, and specific.`
    },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `Analyze these ${imagesToAnalyze.length} images to create a comprehensive style profile. Identify:

1. **Top 3 Style Categories** (e.g., minimalist, streetwear, bohemian, professional, avant-garde, etc.)
2. **Color Palette Preferences** (specific colors they gravitate toward)
3. **Aesthetic Traits** (key characteristics of their style)
4. **Lifestyle Indicators** (what their photos reveal about their lifestyle)
5. **Luxury Preferences** (do they prefer high-end, contemporary, vintage, sustainable brands?)

Return your analysis as a JSON object with this structure:
{
  "topStyles": ["style1", "style2", "style3"],
  "colorPalette": ["color1", "color2", "color3", "color4", "color5"],
  "aestheticTraits": ["trait1", "trait2", "trait3", "trait4"],
  "lifestyle": "brief description",
  "luxuryProfile": "brief description",
  "vicInsight": "A personal, sophisticated message from you (Vic) about their unique style - 2-3 sentences"
}

Be specific and insightful. Avoid generic descriptions.`
        },
        ...imagesToAnalyze.map(url => ({
          type: 'image_url',
          image_url: {
            url: url,
            detail: 'low' // Use low detail to save tokens
          }
        }))
      ]
    }
  ];

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // GPT-4o supports vision
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to analyze images');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

/**
 * Chat with Vic about style, outfits, and fashion advice
 * @param {Array<Object>} conversationHistory - Previous messages in the conversation
 * @param {string} userMessage - Current user message
 * @param {string|null} imageDataUrl - Optional image for outfit review
 * @param {Object|null} styleProfile - User's style profile for context
 * @returns {Promise<string>} Vic's response
 */
export const chatWithVic = async (conversationHistory, userMessage, imageDataUrl = null, styleProfile = null) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add your API key in settings.');
  }

  // Build system message with style profile context
  let systemMessage = `You are Vic, a helpful AI assistant specializing in fashion and personal style. You provide friendly, conversational responses to any questions or topics.

Key traits:
- Answer questions naturally and directly, just like ChatGPT would
- When discussing fashion/style, be knowledgeable and sophisticated
- For non-fashion topics, respond helpfully and conversationally
- Be warm, encouraging, and personable
- Keep responses concise and clear unless asked for details`;

  if (styleProfile) {
    systemMessage += `\n\nNote: This user has a style profile indicating interests in ${styleProfile.topStyles?.join(', ')}. When giving fashion advice, consider their aesthetic preferences.`;
  }

  // Build messages array
  const messages = [
    { role: 'system', content: systemMessage },
    ...conversationHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }))
  ];

  // Only add current user message if it has an image (for image analysis)
  // Otherwise, the message is already in conversationHistory
  if (imageDataUrl) {
    messages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: userMessage || 'What do you think of this outfit? Any suggestions?'
        },
        {
          type: 'image_url',
          image_url: {
            url: imageDataUrl,
            detail: 'high' // Use high detail for outfit analysis
          }
        }
      ]
    });
  }

  try {
    console.log('Sending request to OpenAI with', messages.length, 'messages');

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 800,
        temperature: 0.8
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to get response from Vic';

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      console.error('OpenAI API Error Response:', errorText);
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);

    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    throw error;
  }
};
