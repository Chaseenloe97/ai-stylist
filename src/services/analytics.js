/**
 * Analytics Service for tracking user signups
 * Sends user data to Google Sheets
 */

/**
 * Send signup data to Google Sheets
 * @param {Object} userData - User signup data
 * @returns {Promise<boolean>} Success status
 */
export const trackSignup = async (userData) => {
  // Get Google Sheets Web App URL from environment variable
  const sheetsUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;

  if (!sheetsUrl) {
    console.warn('Google Sheets tracking not configured');
    return false;
  }

  try {
    const payload = {
      timestamp: new Date().toISOString(),
      name: userData.name || '',
      email: userData.email || '',
      instagram: userData.instagram || '',
      interests: Array.isArray(userData.interests) ? userData.interests.join(', ') : '',
      signupDate: userData.signupDate || new Date().toISOString()
    };

    const response = await fetch(sheetsUrl, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Sheets Web App
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Note: no-cors mode doesn't allow reading the response
    // We assume success if no error is thrown
    console.log('Signup tracked successfully');
    return true;
  } catch (error) {
    console.error('Failed to track signup:', error);
    return false;
  }
};
