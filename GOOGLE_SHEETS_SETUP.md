# Google Sheets User Tracking Setup

This guide will help you set up automatic user signup tracking to Google Sheets.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Vic AI Stylist - User Signups" (or any name you prefer)
4. In the first row, add these column headers:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Instagram`
   - E1: `Interests`
   - F1: `Signup Date`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Add new row with user data
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.instagram,
      data.interests,
      data.signupDate
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'User tracked successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (💾 icon)
5. Name the project "Vic User Tracker"

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: "User Signup Tracker"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to Vic User Tracker (unsafe)**
9. Click **Allow**
10. **Copy the Web app URL** (it looks like: `https://script.google.com/macros/s/...../exec`)

## Step 4: Add to Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `ai-stylist` project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_GOOGLE_SHEETS_URL`
   - **Value**: Paste the Web app URL from Step 3
5. Click **Save**
6. Redeploy your app (or it will auto-deploy on next commit)

## Step 5: Test It

1. Visit your website
2. Go through the signup flow
3. Complete all 4 steps
4. Check your Google Sheet - you should see a new row with the user data!

## What Gets Tracked

Every time a user completes the signup flow, this data is saved:
- **Timestamp**: When the signup was submitted
- **Name**: User's name
- **Email**: User's email address
- **Instagram**: Instagram handle (if provided)
- **Interests**: Selected style interests (comma-separated)
- **Signup Date**: ISO timestamp of signup

## Privacy Notes

- Data is sent directly to YOUR Google Sheet
- No third-party analytics services are used
- Users' data stays in your Google account
- Make sure to comply with privacy laws (GDPR, CCPA, etc.) in your region
- Consider adding a privacy policy to your website

## Troubleshooting

**Data not appearing in sheet:**
- Check that the Web App URL is correct in Vercel
- Make sure the Apps Script is deployed as "Anyone" can access
- Check browser console for errors (F12)

**Permission errors:**
- Re-authorize the Apps Script
- Make sure "Execute as" is set to your account
- Check that the sheet isn't in a restricted folder

**Multiple rows for one signup:**
- This shouldn't happen, but if it does, check for duplicate calls in browser console
- The code only tracks once per successful signup
