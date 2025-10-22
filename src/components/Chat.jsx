import { useState, useRef, useEffect } from 'react';
import { getVicGreeting, generateVicResponse, analyzeImageWithVic, vicQuickSuggestions } from '../utils/vicPersonality';
import { chatWithVic, getApiKey } from '../services/openai';

export default function Chat({ styleProfile }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Vic, your AI style assistant. I can help with fashion advice, outfit suggestions, style questions, or just chat about anything. What would you like to talk about?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userInput = input.trim();
    const userMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const hasApiKey = getApiKey();

      let response;

      if (hasApiKey) {
        console.log('Using GPT-4 for chat response...');

        // Build conversation history, excluding the initial greeting
        // Start from index 1 to skip the first "Welcome" message
        const conversationHistory = messages
          .slice(1) // Skip initial greeting
          .filter(msg => !msg.image && msg.content) // Skip image messages and ensure content exists
          .map(msg => ({
            sender: msg.role,
            text: msg.content
          }));

        // Add the current user message to history
        conversationHistory.push({
          sender: 'user',
          text: userInput
        });

        console.log('Sending conversation with', conversationHistory.length, 'messages');

        // Call API with clean conversation history
        response = await chatWithVic(conversationHistory, userInput, null, styleProfile);
      } else {
        console.log('Using mock response...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        response = generateVicResponse(userInput, styleProfile);
      }

      const aiMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);

      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I apologize, but I encountered an issue: ${err.message}\n\nPlease try again or check your internet connection.`,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageSrc = e.target.result;

      setMessages(prev => [...prev, {
        role: 'user',
        content: 'What do you think of this outfit?',
        image: imageSrc,
        timestamp: new Date()
      }]);

      setIsTyping(true);
      setError(null);

      try {
        // Always use real AI if API key exists
        const hasApiKey = getApiKey();

        let feedback;

        if (hasApiKey) {
          // Use real GPT-4 Vision API
          console.log('Using GPT-4 Vision for outfit analysis...');

          // Build conversation history
          const conversationHistory = messages
            .filter(msg => !msg.image)
            .map(msg => ({
              sender: msg.role,
              text: msg.content
            }));

          feedback = await chatWithVic(
            conversationHistory,
            'Please analyze this outfit and provide style feedback.',
            imageSrc,
            styleProfile
          );
        } else {
          // Use mock response
          console.log('Using mock outfit analysis...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          feedback = analyzeImageWithVic(styleProfile);
          feedback += "\n\nWould you like me to suggest similar pieces or styling recommendations?";
        }

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: feedback,
          timestamp: new Date()
        }]);
      } catch (err) {
        console.error('Image analysis error:', err);
        setError(err.message);

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I apologize, but I couldn't analyze that image: ${err.message}`,
          timestamp: new Date(),
          isError: true
        }]);
      } finally {
        setIsTyping(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleQuickSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-cream-200 px-3 md:px-6 py-4 md:py-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-ink-900 flex items-center justify-center">
              <span className="text-xl md:text-2xl text-gold-400 font-serif italic">V</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-serif font-bold text-ink-900">Vic</h2>
              <p className="text-xs md:text-sm text-ink-600 font-light">Your Style Curator</p>
            </div>
          </div>

          {styleProfile && (
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-xs text-ink-600">Your aesthetic:</div>
              <div className="px-3 py-1 bg-cream-100 text-ink-900 text-xs font-medium tracking-wide">
                {styleProfile.topStyles?.[0]?.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instagram Share Tip - Top Banner */}
      {messages.length <= 2 && (
        <div className="px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-purple-200/30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-center">
              <svg className="w-3 h-3 md:w-4 md:h-4 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <p className="text-[10px] md:text-xs text-ink-700 font-light">
                <span className="font-medium">Pro tip:</span> <span className="hidden sm:inline">Send Instagram posts directly to Vic by sharing → "Copy Link" → paste here</span><span className="sm:hidden">Share Instagram posts here</span>
              </p>
            </div>
          </div>
        </div>
      )}


      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-8">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                {/* Avatar */}
                {msg.role === 'assistant' && (
                  <div className="flex items-start space-x-2 md:space-x-3 mb-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-ink-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs md:text-sm text-gold-400 font-serif italic">V</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white border border-cream-200 p-3 md:p-6 shadow-sm">
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="Shared"
                            className="rounded-none mb-3 md:mb-4 max-w-full h-auto"
                          />
                        )}
                        <p className="text-sm md:text-base text-ink-900 leading-relaxed whitespace-pre-wrap font-light">
                          {msg.content}
                        </p>
                      </div>
                      <p className="text-[10px] md:text-xs text-ink-500 mt-1 md:mt-2 ml-1 font-light">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                )}

                {msg.role === 'user' && (
                  <div className="flex flex-col items-end">
                    <div className="bg-ink-900 p-3 md:p-6 shadow-sm max-w-full">
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Uploaded"
                          className="rounded-none mb-3 md:mb-4 max-w-full h-auto"
                        />
                      )}
                      <p className="text-sm md:text-base text-cream-50 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                    <p className="text-[10px] md:text-xs text-ink-500 mt-1 md:mt-2 mr-1 font-light">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-ink-900 flex items-center justify-center">
                  <span className="text-sm text-gold-400 font-serif italic">V</span>
                </div>
                <div className="bg-white border border-cream-200 px-6 py-5 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-ink-900/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-ink-900/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-ink-900/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Suggestions & Upload Prompt */}
      {messages.length <= 2 && !isTyping && (
        <div className="px-3 md:px-6 py-3 md:py-4 bg-gradient-to-b from-white to-cream-50 border-t border-cream-200">
          <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
            {/* Upload Outfit CTA */}
            <div className="card-luxury p-3 md:p-6 bg-gradient-to-r from-cream-50 to-white border-2 border-gold-400/30">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gold-400 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-ink-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-base md:text-lg font-bold mb-1 text-ink-900">Upload Your Outfit</h3>
                    <p className="text-xs md:text-sm text-ink-600 font-light leading-relaxed">
                      Share a photo and Vic will review the fit, style, and suggest improvements
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-gold rounded-none px-3 md:px-6 py-2 md:py-3 whitespace-nowrap ml-2 md:ml-4 text-xs md:text-sm"
                >
                  Upload Photo
                </button>
              </div>
            </div>

            {/* Suggested Topics */}
            <div>
              <p className="text-[10px] md:text-xs tracking-widest uppercase text-ink-600 mb-2 md:mb-3 font-semibold">Or Try These</p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {vicQuickSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="px-2 md:px-4 py-1.5 md:py-2 border border-ink-900/20 text-ink-900 text-xs md:text-sm hover:border-gold-400 hover:bg-cream-50 transition-all duration-200 font-light"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t-2 border-cream-200 px-3 md:px-6 py-3 md:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 p-2 md:p-3 text-ink-900 hover:bg-cream-100 transition-colors border border-cream-200"
              title="Upload image"
            >
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            <div className="flex-1 min-w-0">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Share your style questions..."
                rows="1"
                className="input-luxury resize-none w-full text-sm md:text-base"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex-shrink-0 btn-primary rounded-none disabled:opacity-30 disabled:cursor-not-allowed px-4 md:px-8 py-3 text-sm md:text-base"
            >
              Send
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs text-ink-500 text-center font-light italic">
              Vic provides curated style guidance. All recommendations are AI-generated.
            </p>

            {/* Instagram Share Tip */}
            <div className="card-luxury p-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-200/30">
              <div className="flex items-center justify-center space-x-2 text-center">
                <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <p className="text-xs text-ink-700 font-light">
                  <span className="font-medium">Pro tip:</span> Send Instagram posts directly to Vic by sharing → "Copy Link" → paste here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
