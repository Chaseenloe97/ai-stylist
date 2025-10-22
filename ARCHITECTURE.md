# AI Stylist - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    React App                            │ │
│  │                                                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐         │ │
│  │  │   Home   │  │   Chat   │  │   Profile    │         │ │
│  │  │  Screen  │  │  Screen  │  │   Screen     │         │ │
│  │  └────┬─────┘  └────┬─────┘  └──────┬───────┘         │ │
│  │       │             │                │                 │ │
│  │       └─────────────┴────────────────┘                 │ │
│  │                     │                                   │ │
│  │                     ▼                                   │ │
│  │            ┌─────────────────┐                         │ │
│  │            │   App.jsx       │                         │ │
│  │            │  (State Mgmt)   │                         │ │
│  │            └────────┬────────┘                         │ │
│  │                     │                                   │ │
│  └─────────────────────┼─────────────────────────────────┘ │
│                        │                                    │
│  ┌─────────────────────┼─────────────────────────────────┐ │
│  │              Utilities & Services                      │ │
│  │                     │                                   │ │
│  │  ┌──────────────────┴──────────────────┐              │ │
│  │  │                                      │              │ │
│  │  ▼                                      ▼              │ │
│  │ ┌──────────────────┐      ┌───────────────────┐       │ │
│  │ │ imageAnalysis.js │      │   mockAI.js       │       │ │
│  │ │                  │      │                   │       │ │
│  │ │ • extractColors  │      │ • generateResponse│       │ │
│  │ │ • analyzePalette │      │ • analyzeImage    │       │ │
│  │ │ • inferStyle     │      │ • recognizeItems  │       │ │
│  │ └────────┬─────────┘      └─────────┬─────────┘       │ │
│  │          │                           │                 │ │
│  └──────────┼───────────────────────────┼─────────────────┘ │
│             │                           │                   │
│  ┌──────────▼───────────────────────────▼─────────────────┐ │
│  │              Browser Storage                            │ │
│  │                                                         │ │
│  │         ┌─────────────────────────────┐                │ │
│  │         │      localStorage            │                │ │
│  │         │                              │                │ │
│  │         │  styleProfile: {             │                │ │
│  │         │    summary,                  │                │ │
│  │         │    topStyles,                │                │ │
│  │         │    topTags                   │                │ │
│  │         │  }                           │                │ │
│  │         └─────────────────────────────┘                │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Canvas API                                  │ │
│  │         (Image Processing)                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘

                         ▲
                         │
                         │ User Interaction
                         │
                    ┌────┴─────┐
                    │   User   │
                    └──────────┘
```

## Data Flow

### 1. Style Learning Flow

```
User uploads photos
       │
       ▼
  File Input
       │
       ▼
  FileReader API
       │
       ▼
  Base64 Image Data
       │
       ▼
  Canvas API
       │
       ▼
  extractColors()
  (samples pixels, finds dominant colors)
       │
       ▼
  analyzeColorPalette()
  (determines: neutrals, warm, cool, monochrome)
       │
       ▼
  inferStyle()
  (maps colors → style tags)
       │
       ▼
  generateStyleSummary()
  (aggregates results)
       │
       ▼
  localStorage.setItem()
  (saves profile)
       │
       ▼
  Update UI
  (shows style summary)
```

### 2. Chat Interaction Flow

```
User sends message
       │
       ▼
  Input validation
       │
       ▼
  generateResponse()
  (analyzes intent)
       │
       ├─ "shopping" → shopping responses
       ├─ "match" → style advice
       └─ "style" → aesthetic feedback
       │
       ▼
  Context injection
  (uses styleProfile from localStorage)
       │
       ▼
  Response generation
  (mock AI logic)
       │
       ▼
  Update messages array
       │
       ▼
  Render in UI
```

### 3. Image Upload in Chat Flow

```
User uploads image
       │
       ▼
  FileReader API
       │
       ▼
  Base64 conversion
       │
       ▼
  Display in chat
       │
       ▼
  analyzeImageForChat()
  (uses styleProfile)
       │
       ▼
  recognizeProducts()
  (mock product detection)
       │
       ▼
  Format response
       │
       ▼
  Show AI message
```

## Component Hierarchy

```
App
 ├─ Navigation State (currentTab)
 ├─ Style Profile State (styleProfile)
 │
 ├─ Home Component
 │   ├─ File Upload
 │   ├─ Image Previews
 │   ├─ Analyze Button
 │   └─ Results Display
 │
 ├─ Chat Component
 │   ├─ Messages List
 │   ├─ Message Input
 │   ├─ Image Upload
 │   └─ Quick Prompts
 │
 └─ Profile Component
     ├─ Style Summary
     ├─ Tags Display
     ├─ Tips Accordion
     └─ Refine Button
```

## State Management

### Global State (App.jsx)
```javascript
{
  currentTab: 'home' | 'chat' | 'profile',
  styleProfile: {
    summary: string,
    topStyles: string[],
    topTags: string[]
  }
}
```

### Local State (Components)

**Home:**
```javascript
{
  isAnalyzing: boolean,
  uploadedImages: string[],
  styleResult: StyleProfile | null
}
```

**Chat:**
```javascript
{
  messages: Message[],
  input: string,
  isTyping: boolean
}
```

**Profile:**
```javascript
{
  showTips: boolean
}
```

## Utility Functions

### imageAnalysis.js

| Function | Input | Output | Purpose |
|----------|-------|--------|---------|
| `extractColors()` | Image element | Color array | Find dominant colors |
| `analyzeColorPalette()` | Colors | Tags | Classify color palette |
| `inferStyle()` | Tags | Style array | Map colors to styles |
| `generateStyleSummary()` | All tags/styles | Summary object | Aggregate analysis |

### mockAI.js

| Function | Input | Output | Purpose |
|----------|-------|--------|---------|
| `generateResponse()` | Message, style | Response text | Chat AI |
| `analyzeImageForChat()` | Style profile | Feedback | Image analysis |
| `recognizeProducts()` | - | Product array | Mock product detection |
| `suggestOutfit()` | Style | Outfit description | Outfit suggestions |

## Storage Schema

### localStorage

```javascript
{
  "styleProfile": {
    "summary": "Your vibe: Minimalist + Modern",
    "topStyles": ["minimalist", "modern", "clean"],
    "topTags": ["neutral-tones", "monochrome", "light-neutrals"]
  }
}
```

## Privacy Model

```
┌─────────────────────────────────────┐
│         User's Device                │
│                                      │
│  Photos → Analysis → Results        │
│            ↓                         │
│      localStorage                    │
│                                      │
│  ❌ NO external requests             │
│  ❌ NO server uploads                │
│  ❌ NO tracking                      │
│                                      │
└─────────────────────────────────────┘
```

## Future Architecture (with Real AI)

```
┌─────────────┐         ┌─────────────┐
│   Browser   │  HTTPS  │   Backend   │
│             ├────────>│   Server    │
│  React App  │         │  (Node.js)  │
│             │<────────┤             │
└─────────────┘         └──────┬──────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
                    ▼          ▼          ▼
              ┌─────────┐ ┌────────┐ ┌────────┐
              │ OpenAI  │ │ Lyst   │ │Postgres│
              │   API   │ │  API   │ │   DB   │
              └─────────┘ └────────┘ └────────┘
```

### Backend Endpoints (Future)

```
POST /api/analyze-image
  - Body: { image: base64 }
  - Response: { styles, colors }

POST /api/chat
  - Body: { message, styleProfile, image? }
  - Response: { reply }

GET /api/products/search
  - Query: { q: string }
  - Response: { products: [...] }

GET /api/profile
  - Response: { styleProfile }

PUT /api/profile
  - Body: { styleProfile }
  - Response: { success: true }
```

## Performance Considerations

### Current Optimizations
- Image sampling (every 10th pixel)
- Lazy rendering of components
- localStorage caching
- Debounced user input

### Future Optimizations
- Image compression before analysis
- Web Workers for heavy computation
- Virtual scrolling for long chats
- Image lazy loading
- Service Worker for offline use

## Security Model

### Current (Demo)
- Client-side only
- No authentication
- No sensitive data

### Production Requirements
- JWT authentication
- API rate limiting
- Input sanitization
- HTTPS only
- CSP headers
- API key rotation

## Deployment Architecture

### Current (Dev)
```
Vite Dev Server
     │
     ▼
http://localhost:5173
```

### Production (Static)
```
Build Process
     │
     ▼
Static Files (dist/)
     │
     ▼
CDN (Vercel/Netlify)
     │
     ▼
https://yourdomain.com
```

### Production (Full Stack)
```
React App → CDN
     │
     ▼ API calls
Backend Server → Cloud Platform
     │
     ├─ OpenAI API
     ├─ Database
     └─ Shopping APIs
```

## Technology Decisions

| Choice | Reason |
|--------|--------|
| React | Component architecture, large ecosystem |
| Vite | Fast dev server, modern build tool |
| TailwindCSS | Rapid styling, mobile-first |
| localStorage | No backend needed, simple API |
| Canvas API | Native browser support, performant |
| Mock AI | Demo without API costs |

## Scalability Path

### Phase 1: Demo (Current)
- Single-user, single-device
- Client-side only
- Mock responses

### Phase 2: Personal
- Real AI integration
- Still client-side mostly
- API calls for AI only

### Phase 3: Multi-Device
- Add backend
- User accounts
- Sync across devices

### Phase 4: Social
- User profiles
- Sharing features
- Community content

### Phase 5: Enterprise
- Multi-tenant
- Admin dashboard
- Analytics
- White-label options
