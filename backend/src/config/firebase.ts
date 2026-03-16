import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// You can either use a service account JSON file or initialize without credentials for testing
let firebaseAdmin: admin.app.App;

try {
  // Option 1: Using service account (recommended for production)
  // Download service account JSON from Firebase Console -> Project Settings -> Service Accounts
  // and place it in backend/src/config/serviceAccountKey.json
  
  // Uncomment this when you have the service account key:
  /*
  const serviceAccount = require('./serviceAccountKey.json');
  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  */

  // Option 2: For development - initialize without credentials
  // This works if you're using Firebase Auth client SDK on frontend
  if (!admin.apps.length) {
    firebaseAdmin = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    firebaseAdmin = admin.app();
  }

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error);
  // Initialize a placeholder to avoid crashes
  firebaseAdmin = admin.app();
}

export { firebaseAdmin };
export const firebaseAuth = admin.auth();
