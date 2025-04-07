# Donation Platform with Firebase

A modern donation platform built with Next.js and Firebase.

## Features

- User authentication (signup, login, logout)
- Create and manage donations
- Upload images for donations
- Browse donations by category
- Responsive design for all devices

## Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage services
3. Create a web app in your Firebase project
4. Copy the Firebase configuration values from the Firebase console
5. Update the `.env.local` file with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

6. Set up Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /donations/{donationId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

7. Set up Storage security rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /donations/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your Firebase configuration in `.env.local`
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/firebase/` - Firebase configuration and utility functions
- `src/context/` - React context providers
- `src/components/` - React components
  - `Auth/` - Authentication components
  - `Donation/` - Donation-related components

## Firebase Features Used

- **Authentication**: User signup, login, and session management
- **Firestore**: Storing donation data
- **Storage**: Storing donation images

## License

MIT
