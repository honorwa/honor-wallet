# Firebase & Google Auth Setup Guide

## What Was Fixed

### 1. **Black Screen Issue** ✅
- **Problem:** Firebase config was missing, causing the app to crash on load
- **Solution:** Added fallback Firebase configuration to `.env` file and error handling in `firebase.config.ts`
- **Result:** App now loads even without real Firebase credentials

### 2. **Missing CSS File** ✅
- **Problem:** `index.html` referenced `/index.css` which doesn't exist
- **Solution:** Removed the non-existent CSS link
- **Result:** No more 404 errors

### 3. **Currency Updates** ✅
- **Status:** Already working!
- **How:** App automatically fetches live crypto prices every 30 seconds
- **Location:** See `App.tsx` lines 100-120
- **API:** Uses `fetchLivePrices()` from `services/geminiService.ts`

---

## To Enable Real Firebase Authentication

### Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select your existing `honor-wallet` project
3. Click on "Project Settings" (gear icon)
4. Scroll down to "Your apps" section
5. If you don't have a web app, click the `</>` icon to add one
6. Copy the configuration values

### Step 2: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Save

3. Enable **Google** Sign-in:
   - Click on "Google"
   - Toggle "Enable"
   - Add a project support email
   - Save

### Step 3: Update Your `.env` File

Replace the demo values in your `.env` file with real values from Firebase:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=honor-wallet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=honor-wallet
VITE_FIREBASE_STORAGE_BUCKET=honor-wallet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_actual_measurement_id
```

### Step 4: Configure Google OAuth (for Google Sign-In Button)

The app uses both Firebase AND Google OAuth library for the Google sign-in button.

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project (it's automatically linked)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins:
   ```
   http://localhost:5173
   http://localhost:3000
   https://yourdomain.com
   ```
7. Copy the **Client ID**
8. Update `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

### Step 5: Optional - Enable Gemini AI Features

For AI assistant features:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key
   ```

---

## Current Authentication System

Right now, the app uses **localStorage-based authentication** as a fallback. This means:

✅ **Email/Password login works** (stores users locally)
✅ **Google OAuth works** (but only stores locally without Firebase)
✅ **All features functional** (portfolio, transactions, etc.)
⚠️ **Data is not synced** to Firebase (only local browser storage)
⚠️ **Data will be lost** if you clear browser data

### Once You Configure Firebase:

1. **Email/Password** will use real Firebase Authentication
2. **Google Sign-In** will authenticate through Firebase + sync to Firestore
3. **User data** will be stored in Firebase Firestore
4. **Data persists** across devices and browsers
5. **Password reset** will work via email

---

## Testing the App Right Now

You can test everything without Firebase:

1. **Register a test account:**
   - Email: `test@honor.com`
   - Password: `test123`
   - Name: `Test User`

2. **Features to test:**
   - Portfolio view
   - Buy crypto (simulated)
   - Send crypto
   - Convert between currencies
   - Live price updates (every 30 seconds)
   - Multi-language support (EN/FR/ES/IT)
   - Admin panel (if you register with admin role)

3. **Google Sign-In:**
   - Will show "Not Configured" badge until you add real credentials
   - Will work once you add `VITE_GOOGLE_CLIENT_ID`

---

## Troubleshooting

### Black Screen
- ✅ Fixed! App now has fallback configuration
- Check browser console for errors
- Make sure dev server is running

### Google Sign-In Not Working
- Add real `VITE_GOOGLE_CLIENT_ID` to `.env`
- Make sure you enabled Google in Firebase Authentication
- Check that authorized origins are configured in Google Cloud Console

### Prices Not Updating
- ✅ Already working! Updates every 30 seconds
- Check browser console - should see price updates
- Requires internet connection to fetch prices

### Firebase Errors
- Make sure all Firebase config values are correct
- Check Firebase project settings
- Verify authentication methods are enabled

---

## File Structure

- `.env` - Your configuration (keep secret!)
- `services/firebase.config.ts` - Firebase initialization
- `services/authServiceCompat.ts` - Authentication service
- `components/AuthPage.tsx` - Login/signup page
- `App.tsx` - Main app with currency updates (line 100-120)

---

## Next Steps

1. ✅ App is now working without configuration
2. 🔧 Add Firebase credentials to enable real authentication
3. 🔧 Add Google OAuth client ID for Google sign-in
4. 🔧 Optional: Add Gemini API key for AI features
5. 🚀 Deploy to production

---

**Questions?** Check the browser console for detailed logs showing what's configured and what's missing.
