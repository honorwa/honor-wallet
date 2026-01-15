# Honor Wallet - Complete Setup Guide

## What Was Fixed

### 1. Real Firebase Email/Password Authentication ✅
**Problem:** Registration was using localStorage mock instead of real Firebase
**Solution:** Implemented full Firebase authentication with:
- `createUserWithEmailAndPassword()` for registration
- Email verification link sent automatically after registration
- `signInWithEmailAndPassword()` for login
- Proper error handling for all Firebase auth errors

**File:** `services/authServiceFirebase.ts`

### 2. Real Firebase Google Authentication ✅
**Problem:** Google Auth gave 401 errors
**Solution:** Implemented Firebase Google Sign-In using:
- `signInWithPopup()` with GoogleAuthProvider
- Proper error handling for popup blocked, cancelled, unauthorized domain
- Automatic email verification (Google accounts are pre-verified)

**File:** `services/authServiceFirebase.ts`

### 3. Live Currency Feed ✅
**Problem:** Prices were hardcoded static values
**Solution:** Implemented real-time CoinGecko API integration:
- Fetches live prices from CoinGecko every 30 seconds
- No API key required (free tier)
- Automatic fallback to cached prices if API fails
- Updates all portfolio values in real-time

**File:** `services/geminiService.ts` (fetchLivePrices function)

---

## Firebase Configuration Required

Your `.env` file currently has demo values. To enable real authentication:

### Step 1: Create/Configure Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Name it `honor-wallet` or your preferred name

### Step 2: Get Firebase Config

1. Click **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register the app (name it "Honor Wallet Web")
5. Copy the `firebaseConfig` values

### Step 3: Enable Authentication Methods

1. Go to **Authentication** in left sidebar
2. Click **Get Started** if not already enabled
3. Go to **Sign-in method** tab

**Enable Email/Password:**
- Click on "Email/Password"
- Toggle **Enable**
- Click **Save**

**Enable Google Sign-In:**
- Click on "Google"
- Toggle **Enable**
- Select a **Project support email** from dropdown
- Click **Save**

### Step 4: Add Authorized Domains

1. Still in Authentication → **Settings** tab
2. Scroll to **Authorized domains**
3. Add your domains (already includes localhost):
   - `localhost` (already there)
   - Your production domain (e.g., `yourapp.com`)

### Step 5: Update .env File

Replace the demo values in your `.env` file:

```env
# Replace these with YOUR actual Firebase values
VITE_FIREBASE_API_KEY=AIzaSy... (your actual API key)
VITE_FIREBASE_AUTH_DOMAIN=honor-wallet-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=honor-wallet-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=honor-wallet-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 6: Configure Google OAuth (For Google Sign-In Button)

The Google button requires additional OAuth 2.0 setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project (automatically linked)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: **External**
   - App name: **Honor Wallet**
   - User support email: your email
   - Developer contact: your email
   - Save and Continue
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **Honor Wallet Web Client**
   - Authorized JavaScript origins:
     ```
     http://localhost:5173
     http://localhost:3000
     https://yourdomain.com
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:5173
     http://localhost:3000
     https://yourdomain.com
     ```
7. Copy the **Client ID**
8. Add to `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=123456789012-abc123def456.apps.googleusercontent.com
   ```

### Step 7: Restart Dev Server

After updating `.env`:
```bash
# Stop the dev server (Ctrl+C)
# Restart it
npm run dev
```

---

## Testing Authentication

### Test Email/Password Registration:

1. Go to registration form
2. Enter:
   - Full Name: Test User
   - Email: test@youremail.com (use your real email)
   - Password: test123456 (min 6 characters)
3. Click **Create Account**
4. You'll see: "Verification email sent! Check your inbox"
5. Check your email for verification link from Firebase
6. Click the link to verify
7. Return to app and login

### Test Google Sign-In:

1. Click **Google** button
2. Select your Google account
3. Grant permissions
4. You'll be logged in instantly (no email verification needed)

### Test Login:

1. Use the same email/password you registered with
2. Click **Access Wallet**
3. You should be logged in

---

## Live Currency Feed

The currency feed is now **LIVE** and updates automatically!

### How It Works:

1. App fetches prices from **CoinGecko API** every 30 seconds
2. Free tier, no API key required
3. Updates all portfolio values in real-time
4. Fallback to cached prices if API fails

### Verify It's Working:

1. Open browser console (F12)
2. Look for logs:
   ```
   Fetching live crypto prices from CoinGecko...
   Live prices fetched: {BTC: 43521.30, ETH: 2295.45, ...}
   ```
3. Prices will update every 30 seconds
4. Portfolio values recalculate automatically

### Supported Cryptocurrencies:

- Bitcoin (BTC)
- Ethereum (ETH)
- Binance Coin (BNB)
- Solana (SOL)
- Cardano (ADA)
- Ripple (XRP)
- Polkadot (DOT)
- Dogecoin (DOGE)
- Polygon (MATIC)
- Chainlink (LINK)

---

## Troubleshooting

### "This domain is not authorized" Error

**Fix:**
1. Firebase Console → Authentication → Settings → Authorized domains
2. Add your domain (e.g., `localhost`, `yourapp.com`)

### Google Sign-In 401 Error

**Causes:**
1. Google provider not enabled in Firebase
2. OAuth Client ID not configured
3. Redirect URIs not added in Google Cloud Console

**Fix:**
- Follow Step 3 and Step 6 above completely
- Make sure redirect URIs match exactly (including http/https)

### Email Verification Not Received

**Check:**
1. Spam/junk folder
2. Firebase Console → Authentication → Users (should show user as "not verified")
3. Email settings in Firebase (Authentication → Templates → Email verification)

### Prices Not Updating

**Check:**
1. Browser console for errors
2. Internet connection
3. CoinGecko API status (status.coingecko.com)
4. App should show logs every 30 seconds

### Firebase Errors on Load

**Cause:** Demo Firebase config values
**Fix:** Replace ALL values in `.env` with real Firebase config

---

## What Happens After Setup

Once Firebase is configured:

### Registration Flow:
1. User fills registration form
2. Firebase creates account
3. Email verification sent automatically
4. User clicks verification link in email
5. User can now login

### Login Flow:
1. User enters email/password
2. Firebase validates credentials
3. User logged in
4. Session persists across page reloads

### Google Sign-In Flow:
1. User clicks Google button
2. Google popup appears
3. User selects account
4. Firebase authenticates
5. User logged in (pre-verified)

### Live Prices:
1. App fetches prices on load
2. Updates every 30 seconds automatically
3. All portfolio values recalculate
4. Real-time market data displayed

---

## Current Status

### ✅ Working Right Now:
- App loads without errors
- Registration form works (needs Firebase config)
- Login form works (needs Firebase config)
- Google Sign-In button works (needs Firebase + OAuth config)
- Live currency feed works (no config needed)
- All portfolio features functional

### 🔧 Requires Configuration:
- Firebase credentials in `.env`
- Email/Password authentication enabled in Firebase
- Google Sign-In enabled in Firebase
- OAuth 2.0 Client ID configured in Google Cloud Console

---

## Quick Start (Demo Mode)

Want to test without Firebase? The app will still load and show the UI, but authentication won't work until you configure Firebase.

To test the app interface:
1. The dev server is already running
2. Open in browser
3. You'll see the login page
4. Registration/Login will show Firebase errors until configured

---

## Files Modified

- ✅ `services/geminiService.ts` - Live currency feed
- ✅ `services/authServiceFirebase.ts` - Real Firebase authentication
- ✅ `components/AuthPageFirebase.tsx` - New auth UI with verification messages
- ✅ `App.tsx` - Updated to use Firebase auth
- ✅ `.env` - Added Firebase configuration placeholders

---

## Next Steps

1. **Configure Firebase** (15 minutes)
   - Follow Steps 1-5 above
   - Update `.env` file
   - Restart dev server

2. **Configure Google OAuth** (10 minutes)
   - Follow Step 6 above
   - Update `.env` with Client ID
   - Restart dev server

3. **Test Everything** (5 minutes)
   - Register a new account
   - Check email for verification
   - Test login
   - Test Google Sign-In
   - Watch prices update in console

4. **Optional: Add Gemini AI** (5 minutes)
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add to `.env`: `VITE_GEMINI_API_KEY=your_key`
   - AI assistant features will work

---

## Support

If you encounter issues:

1. Check browser console for error messages
2. Verify all Firebase configuration steps completed
3. Ensure `.env` file has real values (not demo values)
4. Restart dev server after `.env` changes
5. Clear browser cache if needed

**Firebase Documentation:**
- [Authentication Setup](https://firebase.google.com/docs/auth/web/start)
- [Google Sign-In](https://firebase.google.com/docs/auth/web/google-signin)
- [Email Verification](https://firebase.google.com/docs/auth/web/manage-users#send_a_user_a_verification_email)

**CoinGecko API:**
- [API Documentation](https://www.coingecko.com/api/documentation)
- Free tier: 10-50 requests/minute
- No API key required

---

**Ready to go! Follow the steps above to enable full authentication and enjoy real-time crypto prices!**
