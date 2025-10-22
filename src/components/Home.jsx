import { useState } from 'react';
import { extractColors, analyzeColorPalette, inferStyle, generateStyleSummary } from '../utils/imageAnalysis';
import { analyzeStyleProfile, getApiKey } from '../services/openai';
import { selectPhotoFolder, selectPhotoFiles, isFileSystemAccessSupported, compressImage } from '../utils/photoLibrary';

export default function Home({ onStyleLearned }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [styleResult, setStyleResult] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [isConnectingInstagram, setIsConnectingInstagram] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    const imagePreviews = await Promise.all(imagePromises);
    setUploadedImages(prev => [...prev, ...imagePreviews]);
  };

  const handleFolderSelect = async () => {
    try {
      setError(null);

      // Check if File System Access API is supported (Chrome, Edge)
      // If not (Safari, Firefox), use file input fallback
      if (isFileSystemAccessSupported()) {
        // No limit - scan entire folder
        const imageDataUrls = await selectPhotoFolder({ maxImages: Infinity });
        setUploadedImages(prev => [...prev, ...imageDataUrls]);
      } else {
        // Safari/Firefox fallback: allow selecting many photos
        const imageDataUrls = await selectPhotoFiles(500);
        setUploadedImages(prev => [...prev, ...imageDataUrls]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleIndividualPhotos = async () => {
    try {
      setError(null);
      const imageDataUrls = await selectPhotoFiles(50);
      setUploadedImages(prev => [...prev, ...imageDataUrls]);
    } catch (err) {
      setError(err.message);
    }
  };

  const analyzeStyle = async () => {
    if (uploadedImages.length === 0) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Always use real AI if API key exists
      const hasApiKey = getApiKey();

      if (hasApiKey) {
        // Use real GPT-4 Vision analysis
        console.log('Using GPT-4 Vision for analysis...');

        // Compress images before sending to API
        const compressedImages = await Promise.all(
          uploadedImages.map(img => compressImage(img, 1200, 1200, 0.8))
        );

        const aiProfile = await analyzeStyleProfile(compressedImages);

        // Format for our UI
        const summary = {
          topStyles: aiProfile.topStyles || ['modern', 'refined'],
          topTags: aiProfile.colorPalette || ['neutral', 'sophisticated'],
          aestheticTraits: aiProfile.aestheticTraits || [],
          lifestyle: aiProfile.lifestyle || '',
          luxuryProfile: aiProfile.luxuryProfile || '',
          summary: aiProfile.vicInsight || 'Your style has been analyzed by Vic.',
          vicInsight: aiProfile.vicInsight
        };

        setStyleResult(summary);

        if (onStyleLearned) {
          onStyleLearned(summary);
        }
      } else {
        // Use mock analysis (original behavior)
        console.log('Using mock analysis...');
        await new Promise(resolve => setTimeout(resolve, 2500));

        const allColorTags = [];
        const allStyles = [];

        for (const imageSrc of uploadedImages) {
          const img = new Image();
          img.src = imageSrc;

          await new Promise(resolve => {
            img.onload = resolve;
          });

          const colors = await extractColors(img);
          const colorTags = analyzeColorPalette(colors);
          const styles = inferStyle(colorTags);

          allColorTags.push(colorTags);
          allStyles.push(styles);
        }

        const summary = generateStyleSummary(allColorTags, allStyles);
        setStyleResult(summary);

        if (onStyleLearned) {
          onStyleLearned(summary);
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze images. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInstagramConnect = async () => {
    setIsConnectingInstagram(true);

    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demo: show privacy notice
    alert('Instagram Integration\n\nFor your privacy and security, Instagram connection is disabled in this demo.\n\nIn production, this would:\n• Request read-only access to your media\n• Analyze your posts for style patterns\n• Never post or modify your content\n• Store analysis locally on your device\n\nFor now, please use the photo upload feature.');

    setIsConnectingInstagram(false);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRUJFQkRFIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="relative max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16 text-center">
          <div className="inline-block mb-4 md:mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 bg-ink-900 flex items-center justify-center">
              <span className="text-3xl md:text-4xl text-gold-400 font-serif italic">V</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-serif font-bold mb-4 md:mb-6 tracking-tight animate-fade-in">
            Meet Vic
          </h1>

          <p className="text-lg md:text-2xl text-ink-700 mb-6 md:mb-8 max-w-2xl mx-auto font-light tracking-wide animate-slide-up">
            Your Personal Style Curator
          </p>

          <div className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-8 md:mb-12"></div>

          {!styleResult ? (
            <div className="animate-slide-up">
              <p className="text-sm md:text-base text-ink-600 mb-6 md:mb-12 max-w-xl mx-auto leading-relaxed px-4">
                Allow Vic to study your aesthetic through your most cherished looks.
                Together, we'll refine your personal style narrative.
              </p>

              {/* Error Display */}
              {error && (
                <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-800 text-sm">
                  <p className="font-medium">Error:</p>
                  <p>{error}</p>
                </div>
              )}


              {/* Connection Options */}
              <div className="max-w-5xl mx-auto mb-8 md:mb-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Instagram Connect */}
                  <button
                    disabled={true}
                    className="card-luxury p-4 md:p-6 text-left opacity-60 cursor-not-allowed"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-serif text-base md:text-lg font-bold mb-1 flex items-center justify-center gap-2">
                          Connect Instagram
                        </h3>
                        <span className="inline-block text-xs font-light text-ink-900/50 bg-cream-100 px-2 py-0.5 rounded-full border border-cream-200 mb-2">Coming Soon</span>
                        <p className="text-xs text-ink-600 font-light leading-relaxed">
                          Import posts automatically
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Select Individual Photos */}
                  <button
                    onClick={handleIndividualPhotos}
                    className="group card-luxury p-4 md:p-6 text-left hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-serif text-base md:text-lg font-bold mb-2 group-hover:text-gold-600 transition-colors">
                          Select Photos
                        </h3>
                        <p className="text-xs text-ink-600 font-light leading-relaxed">
                          Pick individual photos manually
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Full Library Scan */}
                  <button
                    onClick={handleFolderSelect}
                    className="group card-luxury p-4 md:p-6 text-left hover:shadow-lg transition-all duration-300 border-2 border-gold-200"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gold-400 to-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-serif text-base md:text-lg font-bold mb-2 group-hover:text-gold-600 transition-colors">
                          Full Library Scan
                        </h3>
                        <p className="text-xs text-ink-600 font-light leading-relaxed">
                          {isFileSystemAccessSupported()
                            ? 'Automatically scan entire folder'
                            : 'Select as many photos as you want'}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Photo Library Gallery */}
              {uploadedImages.length > 0 && (
                <div className="max-w-4xl mx-auto">
                  <div className="card-luxury p-4 md:p-8 mb-6 md:mb-8">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <div>
                        <h3 className="font-serif text-xl md:text-2xl font-bold mb-1">Your Style Library</h3>
                        <p className="text-xs md:text-sm text-ink-600 font-light">
                          {uploadedImages.length} {uploadedImages.length === 1 ? 'image' : 'images'} • Vic will analyze all of these
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <button
                          onClick={() => setShowGallery(!showGallery)}
                          className="text-xs md:text-sm text-ink-600 hover:text-gold-600 transition-colors font-medium"
                        >
                          {showGallery ? 'Collapse' : 'View All'}
                        </button>
                        <button
                          onClick={() => setUploadedImages([])}
                          className="text-xs md:text-sm text-ink-600 hover:text-ink-900 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 ${!showGallery && uploadedImages.length > 8 ? 'max-h-96 overflow-hidden relative' : ''}`}>
                      {(showGallery ? uploadedImages : uploadedImages.slice(0, 8)).map((src, idx) => (
                        <div key={idx} className="group relative aspect-square overflow-hidden bg-cream-100">
                          <img
                            src={src}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 md:top-2 md:right-2 w-7 h-7 md:w-8 md:h-8 bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                            >
                              <svg className="w-3 h-3 md:w-4 md:h-4 text-ink-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                              <p className="text-xs text-white font-light">Image {idx + 1}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!showGallery && uploadedImages.length > 8 && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setShowGallery(true)}
                          className="text-sm text-gold-600 hover:text-gold-700 font-medium inline-flex items-center space-x-2"
                        >
                          <span>+{uploadedImages.length - 8} more images</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Add More Button */}
                    <label className="mt-4 md:mt-6 block">
                      <div className="border-2 border-dashed border-ink-900/20 hover:border-gold-400 transition-all duration-300 p-4 md:p-8 text-center cursor-pointer group">
                        <svg className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-ink-900/40 group-hover:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="text-xs md:text-sm text-ink-600 font-light">Add more photos to your library</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {/* Analyze Button */}
                  <button
                    onClick={analyzeStyle}
                    disabled={isAnalyzing}
                    className="btn-gold rounded-none w-full max-w-md mx-auto block disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing {uploadedImages.length} Images...
                      </span>
                    ) : (
                      `Let Vic Analyze Your Style`
                    )}
                  </button>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="mt-8 md:mt-16 pt-8 md:pt-12 border-t border-cream-200">
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl mb-2 md:mb-3">🔒</div>
                    <h3 className="font-serif text-base md:text-lg mb-1 md:mb-2">Private & Secure</h3>
                    <p className="text-xs md:text-sm text-ink-600 font-light">All analysis happens locally on your device</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl mb-2 md:mb-3">✨</div>
                    <h3 className="font-serif text-base md:text-lg mb-1 md:mb-2">AI-Powered</h3>
                    <p className="text-xs md:text-sm text-ink-600 font-light">Advanced algorithms curate your unique style</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl mb-2 md:mb-3">🎨</div>
                    <h3 className="font-serif text-base md:text-lg mb-1 md:mb-2">Comprehensive Analysis</h3>
                    <p className="text-xs md:text-sm text-ink-600 font-light">Every image informs your unique style profile</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="card-luxury p-12 mb-8">
                <div className="mb-8">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center">
                    <svg className="w-8 h-8 text-ink-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <h2 className="text-3xl font-serif font-bold mb-4">Your Style Identity</h2>
                  <p className="text-lg text-ink-700 leading-relaxed mb-4">
                    {styleResult.summary}
                  </p>
                  <p className="text-sm text-ink-600 font-light">
                    Based on analysis of {uploadedImages.length} images from your library
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-cream-200 to-transparent mb-8"></div>

                {/* Style Tags */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold tracking-widest uppercase text-ink-600 mb-4">Aesthetic Essence</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {styleResult.topStyles.map((style, idx) => (
                      <span key={idx} className="px-6 py-3 bg-ink-900 text-cream-50 text-sm font-medium tracking-wide">
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div>
                  <h3 className="text-sm font-semibold tracking-widest uppercase text-ink-600 mb-4">Color Narrative</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {styleResult.topTags.map((tag, idx) => (
                      <span key={idx} className="px-5 py-2 border border-gold-400 text-gold-600 text-sm font-light tracking-wide">
                        {tag.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <p className="text-ink-600 mb-6 font-light">
                  Ready to explore personalized recommendations with Vic?
                </p>
                <button
                  onClick={() => {
                    setStyleResult(null);
                    setUploadedImages([]);
                    setShowGallery(false);
                  }}
                  className="btn-outline rounded-none"
                >
                  Refine Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
