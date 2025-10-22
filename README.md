# AI Stylist - Privacy-First Fashion Assistant

A local-first AI fashion assistant that learns your unique style from photos and provides personalized advice.

## Features

### Privacy-First Design
- **All processing happens locally** in your browser
- No data sent to external servers
- Style profile stored in localStorage
- Complete data control

### Core Functionality
1. **Style Learning** - Upload photos to build your style profile
2. **AI Chat** - Get personalized outfit advice and shopping recommendations
3. **Style Profile** - View your learned aesthetic and preferences

### Local Image Analysis
- Color detection and palette analysis
- Style inference from visual patterns
- Mock AI responses (ready for real AI integration)

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Canvas API** - Client-side image processing

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## How It Works

1. **Upload Photos**: Add 5-10 photos of outfits you love
2. **Local Analysis**: Images are analyzed in-browser using Canvas API
3. **Style Profile**: AI infers your aesthetic from color palettes and patterns
4. **Get Advice**: Chat with AI for outfit suggestions and shopping links

## Future Enhancements

### Real AI Integration
- Connect to OpenAI GPT-4-Vision or Anthropic Claude
- Use FashionCLIP for better style recognition
- Integrate shopping APIs (Lyst, Shopify)

### Mobile App
- Convert to React Native for iOS/Android
- Or use Capacitor to wrap as native app

### Advanced Features
- Outfit composition analysis
- Brand and product recognition
- Seasonal color analysis
- Wardrobe recommendations

## Privacy & Security

- No Instagram credentials required (demo only)
- No external API calls in current version
- All data stays on device
- Clear data by clearing browser localStorage

## Demo vs Production

This is a **demo/prototype** with:
- Mock AI responses
- Local-only processing
- No real social media integration

For production, you would add:
- Real AI vision models
- Secure OAuth for social login
- Backend database for persistence
- Shopping API integrations

## License

MIT - Free to use and modify
