# AI Stylist - Usage Guide

## Quick Start

Your AI Stylist app is now running at **http://localhost:5173**

Open this URL in any browser (Chrome, Safari, Firefox, etc.) to use the app.

## Using the App

### 1. Build Your Style Profile (Home Tab)

**Step 1: Upload Photos**
- Click "Upload Photos" button
- Select 5-10 photos of outfits you love
- These can be:
  - Your own outfit photos
  - Fashion inspiration from Pinterest/Instagram
  - Magazine photos
  - Outfit screenshots

**Step 2: Analyze**
- Click "Learn My Style" button
- Wait 2-3 seconds for local analysis
- See your personalized style profile!

**What Gets Analyzed:**
- Dominant color palettes
- Color preferences (neutrals, warm tones, cool tones)
- Style patterns (minimalist, streetwear, bohemian, etc.)

### 2. Chat with AI (Chat Tab)

Once you have a style profile, you can:

**Ask Questions:**
- "What pants go with this jacket?"
- "Find me minimalist sneakers"
- "Does this fit my style?"
- "Suggest an outfit for today"

**Upload Images:**
- Click the image icon
- Upload outfit photos
- Get instant style feedback

**Get Shopping Suggestions:**
- Ask about specific items
- Get mock product recommendations
- See price ranges and brands

### 3. View Your Profile (Profile Tab)

See your learned style preferences:
- Core aesthetic tags
- Color palette preferences
- Style tips personalized to you
- Statistics about your style

**Refine Your Style:**
- Click "Refine My Style" to upload more photos
- Your profile updates with each analysis

## Privacy Features

**100% Local Processing:**
- All image analysis happens in your browser
- No data sent to servers
- No account required

**Your Data:**
- Style profile saved in browser localStorage
- Clear by: Settings → Clear Browsing Data
- Or manually: Open DevTools → Application → localStorage → Clear

**Instagram Demo:**
- "Connect Instagram" button is disabled
- This is intentional for privacy
- Use photo uploads instead

## On Mobile (iPhone/Android)

1. Open Safari/Chrome on your phone
2. Navigate to `http://[your-computer-ip]:5173`
3. Works like a native app!

**To find your computer's IP:**
```bash
# On Windows
ipconfig

# On Mac/Linux
ifconfig
```

Look for your local network IP (usually starts with 192.168.x.x)

## Testing the App

### Example Workflow:

1. **Upload 5 photos** of minimalist outfits
2. **Click "Learn My Style"**
3. See result: "Your vibe: Minimalist + Modern"
4. **Go to Chat tab**
5. Ask: "What shoes match my style?"
6. Get response: "Try white sneakers or leather loafers"
7. **Upload an image** to chat
8. Get feedback on the specific outfit

## Troubleshooting

**Images not uploading?**
- Check file size (< 10MB recommended)
- Use JPG or PNG formats

**Style analysis stuck?**
- Refresh the page
- Try with fewer images (3-5)

**Chat not responding?**
- Make sure you've built a style profile first
- Type a question and press Enter or click send

**Mobile access not working?**
- Make sure phone and computer are on same WiFi
- Use computer's local IP address, not localhost
- Try disabling firewall temporarily

## Next Steps

This is a **demo version**. For production features:

1. **Real AI Integration:**
   - Sign up for OpenAI API
   - Add API key to environment variables
   - Replace mock responses with real AI

2. **Shopping Links:**
   - Integrate Lyst or Shopify API
   - Add affiliate tracking

3. **Deploy Online:**
   - Build: `npm run build`
   - Deploy to Vercel/Netlify
   - Share with friends!

4. **Convert to Mobile App:**
   - Use Capacitor to wrap as iOS/Android app
   - Or rebuild with React Native

## Support

Questions? Check:
- README.md for technical details
- Source code in /src for implementation
- React/Vite docs for framework help
