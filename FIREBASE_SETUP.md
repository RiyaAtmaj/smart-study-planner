# Firebase Setup Guide

To enable real-time synchronization across devices, you need to set up Firebase:

## Quick Setup (Environment Variables)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase config values in `.env`

## Manual Setup

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "smart-study-planner")
4. Follow the setup wizard

## 2. Enable Realtime Database

1. In your Firebase project, go to "Realtime Database"
2. Click "Create database"
3. Choose "Start in test mode" (you can change security rules later)
4. Select a location for your database

## 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web (</>)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 4. Update Configuration

Update your `.env` file with the actual Firebase config values:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

## 5. Security Rules (Optional but Recommended)

In Firebase Console > Realtime Database > Rules, you can set up basic security:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "groups": {
      ".read": true,
      ".write": true
    },
    "messages": {
      ".read": true,
      ".write": true
    },
    "notes": {
      ".read": true,
      ".write": true
    },
    "sessions": {
      ".read": true,
      ".write": true
    }
  }
}
```

## 6. Test the Setup

1. Run `npm run dev`
2. Create a group and join from multiple browser tabs/windows
3. Send messages and share notes - they should sync in real-time!

## Features Enabled

- **Real-time chat**: Messages appear instantly across all connected users
- **Live group updates**: Member joins/leaves are synchronized
- **Shared notes**: Notes are shared and updated in real-time
- **Study sessions**: Session status updates across devices
- **Cross-device sync**: Works across different browsers and devices

## Troubleshooting

- If you see permission errors, check your Firebase security rules
- Make sure your `.env` file is in the root directory
- Check browser console for Firebase connection errors
- Ensure all environment variables are prefixed with `VITE_` for Vite to expose them