# AI Integration Guide

How to replace mock responses with real AI vision models.

## Current Implementation

Right now, the app uses:
- **Local color analysis** (Canvas API) - REAL
- **Mock AI responses** - SIMULATED
- **Mock product recognition** - SIMULATED

## Option 1: OpenAI GPT-4 Vision

### Setup

1. Get API key from https://platform.openai.com

2. Install OpenAI SDK:
```bash
npm install openai
```

3. Create `.env` file:
```
VITE_OPENAI_API_KEY=your_api_key_here
```

### Update `src/utils/mockAI.js`

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo!
});

export const generateResponse = async (message, userStyle, imageUrl = null) => {
  const messages = [
    {
      role: "system",
      content: `You are a fashion stylist. The user's style is: ${userStyle.join(', ')}. Give concise, helpful advice.`
    },
    {
      role: "user",
      content: imageUrl
        ? [
            { type: "text", text: message },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        : message
    }
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages,
    max_tokens: 300
  });

  return response.choices[0].message.content;
};
```

### Cost Estimate
- GPT-4 Vision: ~$0.01 per image + ~$0.03 per 1K tokens
- ~$0.05 per style analysis
- Budget: $10-50/month for moderate use

---

## Option 2: Anthropic Claude 3.5 Sonnet

### Setup

1. Get API key from https://console.anthropic.com

2. Install Anthropic SDK:
```bash
npm install @anthropic-ai/sdk
```

3. Create `.env` file:
```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

### Update `src/utils/mockAI.js`

```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateResponse = async (message, userStyle, imageBase64 = null) => {
  const content = imageBase64
    ? [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/jpeg",
            data: imageBase64
          }
        },
        {
          type: "text",
          text: message
        }
      ]
    : message;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: `You are a fashion stylist. User's style: ${userStyle.join(', ')}`,
    messages: [
      {
        role: "user",
        content
      }
    ]
  });

  return response.content[0].text;
};
```

### Cost Estimate
- Claude 3.5 Sonnet: ~$3 per million input tokens
- ~$0.01-0.02 per image analysis
- More affordable for high volume

---

## Option 3: Free/Local Models (Ollama)

For **completely offline** AI:

### Setup

1. Install Ollama: https://ollama.ai

2. Pull vision model:
```bash
ollama pull llava
```

3. Install client:
```bash
npm install ollama
```

### Update code:

```javascript
import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

export const generateResponse = async (message, userStyle, imageBase64 = null) => {
  const response = await ollama.chat({
    model: 'llava',
    messages: [
      {
        role: 'system',
        content: `Fashion stylist. User style: ${userStyle.join(', ')}`
      },
      {
        role: 'user',
        content: message,
        images: imageBase64 ? [imageBase64] : undefined
      }
    ]
  });

  return response.message.content;
};
```

### Pros/Cons
- ✅ Free, unlimited use
- ✅ Complete privacy (runs locally)
- ❌ Requires powerful computer
- ❌ Lower quality than GPT-4/Claude

---

## Option 4: FashionCLIP (Best for Style Recognition)

For better fashion-specific understanding:

### Setup

1. Use Replicate API:
```bash
npm install replicate
```

2. Get API key: https://replicate.com

3. Create `.env`:
```
VITE_REPLICATE_API_KEY=your_key
```

### Code:

```javascript
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.VITE_REPLICATE_API_KEY,
});

export const analyzeImageForFashion = async (imageUrl) => {
  const output = await replicate.run(
    "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
    {
      input: {
        image: imageUrl,
        task: "image_captioning"
      }
    }
  );

  return output;
};
```

---

## Recommended Approach

### For MVP/Demo:
Use **mock responses** (current implementation)

### For Production (Low Budget):
Use **Claude 3.5 Sonnet** via API
- Better pricing
- Good vision capabilities
- Fast responses

### For Production (Best Quality):
Use **GPT-4 Vision**
- Best fashion understanding
- More expensive
- Industry standard

### For Privacy-First:
Use **Ollama + LLaVA**
- Completely local
- No API costs
- User data never leaves device

---

## Shopping API Integration

### Lyst API

```javascript
export const searchProducts = async (query) => {
  const response = await fetch(
    `https://api.lyst.com/v1/products?q=${query}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.LYST_API_KEY}`
      }
    }
  );

  return await response.json();
};
```

### Amazon Product Advertising API

Requires:
- Amazon Associates account
- Product Advertising API credentials
- More complex setup but better inventory

---

## Security Best Practices

### NEVER expose API keys in frontend:

Current `.env` approach is **DEMO ONLY**.

For production:

1. **Create backend API:**
```javascript
// server.js (Node.js backend)
app.post('/api/chat', async (req, res) => {
  const response = await openai.chat.completions.create({...});
  res.json(response);
});
```

2. **Call from frontend:**
```javascript
// No API key in frontend!
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message, image })
});
```

3. **Deploy backend separately:**
- Backend: Heroku, Railway, Fly.io
- Frontend: Vercel, Netlify

---

## Next Steps

1. Choose your AI provider
2. Sign up and get API key
3. Update environment variables
4. Replace mock functions with real API calls
5. Test thoroughly
6. Move API keys to backend for production
7. Deploy!

## Questions?

Check official docs:
- OpenAI: https://platform.openai.com/docs
- Anthropic: https://docs.anthropic.com
- Replicate: https://replicate.com/docs
- Ollama: https://ollama.ai/docs
