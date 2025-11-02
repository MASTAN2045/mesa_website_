# 🔥 Firebase Setup Guide for MESA Website

## Why Firebase?
- **Real-time Updates**: Events appear instantly on all devices
- **Secure Authentication**: Proper user management with email verification
- **Free Tier**: Perfect for MESA's needs (up to 50,000 reads/day)
- **No Backend Required**: Firebase handles everything
- **Scalable**: Can handle thousands of users

## Step-by-Step Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://firebase.google.com)
2. Click "Go to Console" → "Add Project"
3. Name it: `mesa-website`
4. Disable Google Analytics (not needed)
5. Click "Create Project"

### 2. Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password**
5. Click **Save**

### 3. Enable Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for now)
4. Select location: **asia-south1** (Mumbai - closest to India)
5. Click **Done**

### 4. Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app** icon (`</>`)
4. Name it: `MESA Website`
5. Copy the `firebaseConfig` object

### 5. Update Your Website
1. Open `js/firebase-config.js`
2. Replace the placeholder config with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "mesa-website.firebaseapp.com",
  projectId: "mesa-website",
  storageBucket: "mesa-website.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

### 6. Set Up Admin Account
1. Go to your website's `admin.html`
2. Click "Join MESA" tab
3. Register with email: `admin-mesa@iitpkd.ac.in`
4. Check your email for verification
5. Now you can login as admin!

### 7. Configure Firestore Security Rules
In Firebase Console → Firestore → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Events - readable by all, writable by authenticated users
    match /events/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.token.email.matches('.*@smail.iitpkd.ac.in') || 
         request.auth.token.email == 'admin-mesa@iitpkd.ac.in');
    }
    
    // Members - only admin can read/write
    match /members/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == 'admin-mesa@iitpkd.ac.in';
    }
    
    // Join requests - authenticated users can create, admin can read/write
    match /joinRequests/{document} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && 
        request.auth.token.email == 'admin-mesa@iitpkd.ac.in';
    }
  }
}
```

## Features You Get

### ✅ For Admin (`admin-mesa@iitpkd.ac.in`)
- Add/Edit/Delete events in real-time
- Approve/Reject member requests
- View all system data
- Email verification required

### ✅ For Students (`@smail.iitpkd.ac.in`)
- Register for MESA membership
- View events (if given member access)
- Email verification required

### ✅ For Public
- View events on calendar page
- Real-time updates without refresh
- Fast loading from Firebase CDN

## Testing Your Setup

1. **Test Admin Login**:
   - Go to `admin.html`
   - Login with `admin-mesa@iitpkd.ac.in`
   - Add a test event
   - Check if it appears on `calendar.html`

2. **Test Student Registration**:
   - Go to `join-mesa.html`
   - Register with a test `@smail.iitpkd.ac.in` email
   - Check Firebase Console → Authentication for new user

3. **Test Real-time Updates**:
   - Open `calendar.html` in two browser tabs
   - Add event in admin panel
   - Watch it appear instantly in both tabs!

## Deployment Options

### Option 1: GitHub Pages (Free)
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select source branch
4. Your site will be live at `username.github.io/mesa-website`

### Option 2: Firebase Hosting (Free)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run: `firebase login`
3. Run: `firebase init hosting`
4. Run: `firebase deploy`
5. Your site will be live at `mesa-website.web.app`

### Option 3: Netlify (Free)
1. Drag your folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get instant live URL
3. Connect to GitHub for auto-deployment

## Security Best Practices

1. **Email Verification**: Always verify emails before granting access
2. **Firestore Rules**: Use the security rules provided above
3. **Admin Email**: Keep `admin-mesa@iitpkd.ac.in` secure
4. **Regular Backups**: Firebase auto-backs up, but export data monthly

## Troubleshooting

### "Firebase not defined" Error
- Make sure you're using `type="module"` in script tags
- Check if Firebase config is correct

### "Permission denied" Error
- Update Firestore security rules
- Ensure user is authenticated and email is verified

### Events not showing
- Check browser console for errors
- Verify Firestore rules allow read access
- Check if events collection exists

## Cost Estimate

Firebase is **FREE** for your use case:
- **Firestore**: 50,000 reads/day (you'll use ~100/day)
- **Authentication**: 10,000 users (you'll have ~500 max)
- **Hosting**: 10GB bandwidth (you'll use ~1GB)

You won't pay anything unless MESA becomes huge!

## Support

If you need help:
1. Check Firebase Console for error messages
2. Look at browser developer console
3. Firebase has excellent documentation
4. The code includes detailed error handling

---

**🎉 Once set up, your MESA website will be professional, secure, and scalable!**
